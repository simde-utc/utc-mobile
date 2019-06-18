import React from 'react';
import { ScrollView, FlatList, Text, View, SectionList } from 'react-native';
import styles from '../../styles';
import { ACTUS_UTC_FEED_LOGIN } from '../../../config';

import CASAuth from '../../services/CASAuth';
import PortailApi from '../../services/Portail';
import ActualitesUTC from '../../services/ActualitesUTC';

import Generate from '../../utils/Generate';

import Filter from '../../components/Filter';
import ArticleComponent from '../../components/Articles/Article';
import FakeItem from '../../components/FakeItem';

const DEFAULT_ARTICLES_PAGINATION = 6; // debug pour bien vérifier le chargement en plusieurs fois
// seuil qui définit le chargement de nouveaux articles : si THRESHOLD = 0.1 alors on commence à charger de nouveaux articles quand on atteint les 10 derniers pourcents
const THRESHOLD = 0.4;

export default class ArticlesScreen extends React.Component {
	static navigationOptions = {
		headerTitle: 'Actualités',
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	};

	constructor(props) {
		super(props);

		this.willUnmount = false;
		this.state = {
			page: 0,
			pagination: DEFAULT_ARTICLES_PAGINATION,
			canLoadMoreUTCArticles: true,
			canLoadMorePortailArticles: true,
			articles: [],
			filters: [
				{
					id: 'utc',
					name: 'utc',
					filter(article) {
						return article.article_type === this.id;
					},
					conflict: [],
				},
				{
					id: 'assos',
					name: 'assos',
					filter(article) {
						return article.article_type === this.id;
					},
					conflict: ['fav'],
				},
				{
					id: 'fav',
					name: 'favoris',
					favoris: [],
					filter(article) {
						return (
							article.article_type === 'assos' &&
							(article.owned_by && this.favoris.includes(article.owned_by.id))
						);
					},
					conflict: ['assos'],
				},
			].reduce((acc, val) => {
				acc[val.id] = val;
				return acc;
			}, {}),
			selectedFilters: [],
			loading: false,
			search: '',
		};

		PortailApi.getUserAssos().then(assos => {
			this.setState(prevState => {
				for (const asso of assos) prevState.filters.fav.favoris.push(asso.id);
				return prevState;
			});
		});

		const { selectedFilters } = this.state;

		if (CASAuth.isConnected()) {
			selectedFilters.push('utc');
		}

		if (PortailApi.isConnected()) {
			selectedFilters.push('assos');
		}

		this.props.articleHeight = 100;
	}

	componentDidMount() {
		this.loadMoreContentAsync();
	}

	componentWillUnmount() {
		this.willUnmount = true;
	}

	onlySelectFilter(name) {
		if (this.willUnmount) {
			return;
		}
		this.setState(prevState => {
			prevState.selectedFilters = [name];

			return prevState;
		});
	}

	onSearchTextChange(text) {
		text = Generate.searchText(text);
		this.setState(prevState => {
			prevState.search = text;

			return prevState;
		});

		return text;
	}

	selectFilter(name) {
		if (this.willUnmount) {
			return;
		}
		this.setState(prevState => {
			for (const conflict of prevState.filters[name].conflict) {
				const index = prevState.selectedFilters.indexOf(conflict);

				if (index > -1) prevState.selectedFilters.splice(index, 1);
			}
			prevState.selectedFilters.push(name);

			return prevState;
		});
	}

	unselectFilter(name) {
		if (this.willUnmount) {
			return;
		}

		this.setState(prevState => {
			if (prevState.selectedFilters.length === 1 && prevState.selectedFilters.includes(name))
				return prevState;

			const index = prevState.selectedFilters.indexOf(name);

			if (index > -1) prevState.selectedFilters.splice(index, 1);

			return prevState;
		});
	}

	loadPortailArticles() {
		const { pagination, page } = this.state;

		return PortailApi.getArticles(pagination, page + 1, 'latest').then(([articles, status]) => {
			if (status === 416) {
				this.setState(prevState => ({ ...prevState, canLoadMorePortailArticles: false }));
			}

			return articles.map(article => {
				article.article_type = 'assos';
				article.created_at = article.created_at.replace(' ', 'T');
				return article;
			});
		});
	}

	loadUTCArticles() {
		const { pagination, page } = this.state;

		return CASAuth.getService(ACTUS_UTC_FEED_LOGIN)
			.then(([serviceTicket]) => {
				const actus = new ActualitesUTC(serviceTicket);

				return actus
					.loadArticles()
					.then(() => {
						return actus.getArticles(pagination, page + 1, 'latest').map(article => {
							article.article_type = 'utc';

							return article;
						});
					})
					.catch(([response, status]) => {
						console.log([response, status]);

						if (this.willUnmount) {
							return;
						}
						switch (status) {
							case 416:
								this.setState(prevState => ({ ...prevState, canLoadMoreUTCArticles: false }));
								break;
							case 523:
							default:
								// TODO: afficher réseau ou inconnue
								console.warn([response, status]);
								this.setState(prevState => ({ ...prevState, canLoadMoreUTCArticles: false }));
								break;
						}

						return [];
					});
			})
			.catch(() => {
				return [];
			});
	}

	loadMoreContentAsync() {
		const { canLoadMorePortailArticles, canLoadMoreUTCArticles, loading } = this.state;

		if (this.willUnmount) {
			return;
		} // à tester avant chaque setstate pour éviter les re-render inutiles et les "memory leaks" (d'après expo). Si on avait une biblio de gestion de l'état on aurait pas besoin de faire ça
		if (!canLoadMorePortailArticles || loading) return;

		const promises = [];



		if (CASAuth.isConnected() && canLoadMoreUTCArticles) {
			const UTCArticles = this.loadUTCArticles();

			promises.push(UTCArticles);
		}



		if (PortailApi.isConnected() && canLoadMorePortailArticles) {
			const PortailArticles = this.loadPortailArticles();

			promises.push(PortailArticles);
		}

		if (this.willUnmount) {
			return;
		}
		if (promises) {
			this.setState(prevState => ({ ...prevState, loading: true }));

			return new Promise.all(promises)
				.then(([articles, articles2]) => {
					if (!(articles || articles2)) return;

					if (articles && articles2) articles = articles.concat(articles2);
					else articles = articles || articles2;

					articles.sort((article1, article2) => {
						return new Date(article1.created_at || article1.date_gmt) >
							new Date(article2.created_at || article2.date_gmt)
							? -1
							: 1;
					});
					if (this.willUnmount) {
						return;
					}
					this.setState(
						prevState => {
							prevState.page++;
							return prevState;
						},
						() => {
							// il faut être sûr d'incrémenter la pagination avant d'autoriser le chargement de nouveaux articles
							if (this.willUnmount) {
								return;
							}
							this.setState(prevState => {
								prevState.articles = prevState.articles.concat(articles);
								prevState.loading = false;
								return prevState;
							});
						}
					);
				})
				.catch(e => {
					console.warn(e);
					if (this.willUnmount) {
						return;
					}
					this.setState(prevState => ({ ...prevState, loading: false }));
				});
		}
	}

	render() {
		const { navigation } = this.props;
		const { search, articles, filters, selectedFilters, loading } = this.state;
		const toMatch = search.toLowerCase().split(' ');

		/*const data = articles.filter(article => {
			// if (!selectedFilters.includes(article['article_type']))
			//	return false
			let filtered = true;
			for (const fl of selectedFilters) {
				if (filters[fl].filter(article)) {
					filtered = false;
					break;
				}
			}
			if (filtered) return false;

			for (let i = 0; i < toMatch.length; i++) {
				if (toMatch[i][0] === '#') {
					console.log(`${toMatch[i]} à faire`);

					continue; // TODO: il faudrait checker les tags
				} else if (
					article.title.toLowerCase().indexOf(toMatch[i]) < 0 &&
					(article.description || article.excerpt).toLowerCase().indexOf(toMatch[i]) < 0 &&
					article.content.toLowerCase().indexOf(toMatch[i]) < 0
				)
					return false;
			}

			return true;
		});*/

		//if (loading)
		//	return <ScrollView style={styles.scrollable.list}><FakeItem title={"Chargement..."}/></ScrollView>;
		return <FlatList style={styles.scrollable.list}
										 data={articles}
										 renderItem={(item) => <ArticleComponent data={item} navigation={navigation}/>}
										 ItemSeparatorComponent={() => <View style={styles.scrollable.sectionSeparator}/>}
										 onEndReached={this.loadMoreContentAsync.bind(this)}
										 onEndReachedThreshold={THRESHOLD}
										 keyExtractor={article => `${article.article_type}_${article.id}`}
										 ListFooterComponent={
											 <View>
												 {articles.length > 0 ? <View style={styles.scrollable.sectionSeparator}/> : null}
												 <FakeItem title={"Chargement..."}/>
											 </View>
										 }

		/>
	}
}
