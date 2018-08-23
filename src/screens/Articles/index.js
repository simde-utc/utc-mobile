import React from 'react';
import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import styles from '../../styles'

import CASAuth from '../../services/CASAuth';
import Portail from '../../services/Portail';

import ActualitesUTC from '../../services/ActualitesUTC';

import Filter from '../../components/Filter';
import ArticleComponent from '../../components/Articles/Article';

const DEFAULT_ARTICLES_PAGINATION = 6; //debug pour bien vérifier le chargement en plusieurs fois
//seuil qui définit le chargement de nouveaux articles : si THRESHOLD = 0.1 alors on commence à charger de nouveaux articles quand on atteint les 10 derniers pourcents
const THRESHOLD = 0.4;

export default class ArticlesScreen extends React.Component {
	static navigationOptions = {
		title: 'Articles',
		headerStyle: {
			display: 'none',
		}
	};

	constructor(props) {
		super(props);

		this.state = {
			page: 0,
			pagination: DEFAULT_ARTICLES_PAGINATION,
			canLoadMoreUTCArticles: true,
			canLoadMorePortailArticles: true,
			articles: [],
			filters: [
				'utc', 'assos',
			],
			selectedFilters: [],
			loading: false,
			search: '',
		};

		if (CASAuth.isConnected())
			this.state.selectedFilters.push('utc')

		if (Portail.isConnected())
			this.state.selectedFilters.push('assos')

		this.props.articleHeight = 100;
	}

	componentDidMount() {
		this._loadMoreContentAsync()
	}

	_loadMoreContentAsync() {
		if (!this.state.canLoadMorePortailArticles || this.state.loading) return

		var promises = []

		if (CASAuth.isConnected() && this.state.canLoadMoreUTCArticles) {
			var UTCArticles = this._loadUTCArticles()

			promises.push(UTCArticles)
		}

		if (Portail.isConnected() && this.state.canLoadMorePortailArticles) {
			var PortailArticles = this._loadPortailArticles()

			promises.push(PortailArticles)
		}

		if (promises) {
			this.setState(prevState => ({ ...prevState, loading: true }))

			return new Promise.all(promises).then(([articles, articles2]) => {

				if (!(articles || articles2)) return

				if (articles && articles2)
					articles = articles.concat(articles2)
				else
					articles = articles || articles2

				articles.sort((article1, article2) => {
					return new Date(article1.created_at || article1.date_gmt) > new Date(article2.created_at || article2.date_gmt) ? -1 : 1
				})

				this.setState(prevState => {
					prevState.page++;
					return prevState;
				},
				() => {
					//il faut être sûr d'incrémenter la pagination avant d'autoriser le chargement de nouveaux articles
					this.setState( prevState => {
						prevState.articles = prevState.articles.concat(articles);
						prevState.loading = false;
						return prevState;
					});
				});
			}).catch((e) => {console.warn(e); this.setState(prevState => ({ ...prevState, loading: false })) })
		}
	}

	_loadUTCArticles() {
		return CASAuth.getService(process.env.ACTUS_UTC_FEED_LOGIN).then(([serviceTicket]) => {
			var actus = new ActualitesUTC(serviceTicket)

			return actus.loadArticles().then(() => {
				return actus.getArticles(this.state.pagination, this.state.page + 1, 'latest').map((article) => {
					article['article_type'] = 'utc'

					return article
				})
			}).catch(([response, status]) => {
				switch(status) {
					case 416:
						this.setState(prevState => ({ ...prevState, canLoadMoreUTCArticles: false }));
						break
					case 523:
					default:
						//TODO: afficher réseau ou inconnue
						console.warn([response, status])
						this.setState(prevState => ({ ...prevState, canLoadMoreUTCArticles: false }));
						break
				}

				return []
			})
		}).catch(() => {
			return []
		})
	}

	_loadPortailArticles() {
		return Portail.getArticles(this.state.pagination, this.state.page + 1, 'latest').then(([response, status]) => {
			return response.map((article) => {
				article['article_type'] = 'assos'
				article["created_at"] = article["created_at"].replace(' ', 'T')

				return article
			})
		}).catch(([response, status]) => {
			if (status === 416)
				this.setState(prevState => ({ ...prevState, canLoadMorePortailArticles: false }))

			return []
		})
	}

	unselectFilter(name) {
		this.setState(prevState => {
			if (prevState.selectedFilters.length === 1 && prevState.selectedFilters.includes(name))
				return prevState

			var index = prevState.selectedFilters.indexOf(name)

			if (index > -1)
				prevState.selectedFilters.splice(index, 1)

			return prevState
		})
	}

	selectFilter(name) {
		this.setState(prevState => {
			prevState.selectedFilters.push(name)

			return prevState
		})
	}

	render() {
		const toMatch = this.state.search.toLowerCase().split(' ')

		const data = this.state.articles.filter((article) => {
			if (!this.state.selectedFilters.includes(article['article_type']))
				return false

			for (let i = 0; i < toMatch.length; i++) {
				if (toMatch[i][0] === '#') {
					console.log(toMatch[i] + ' à faire')
					continue // TODO: il faudrait checker les tags
				}
				else if (
					article.title.toLowerCase().indexOf(toMatch[i]) < 0
					&& (article.description || article.excerpt).toLowerCase().indexOf(toMatch[i]) < 0
					&& article.content.toLowerCase().indexOf(toMatch[i]) < 0
				)
					return false
			}

			return true
		})

		return (
			<View style={ styles.article.articlesFeedContainer }>
				<Filter
					filters={ this.state.filters }
					selectedFilters={ this.state.selectedFilters }
					onFilterUnselected={ this.unselectFilter.bind(this) }
					onFilterSelected={ this.selectFilter.bind(this) }
					searchButton={ false }
					onSearchTextChange={(text) => {
						text = text.replace(/[^A-Za-zÀ-ž0-9-_#]+/g, ' ').replace('  ', ' ')
						this.setState((prevState) => {
							prevState.search = text

							return prevState
						})

						return text
					}}
				/>
				<FlatList
					ref={(component) => ( this.flatList = component )}
					data={ data }
					renderItem={({item}) => <ArticleComponent data={item} />}
					onEndReached={ this._loadMoreContentAsync.bind(this) }
					onEndReachedThreshold = {THRESHOLD}
					keyExtractor={ (article) => article['article_type'] + '_' + article['id'] }
					ListFooterComponent = { <View style={ styles.article.loadingIndicatorContainer }>{ this.state.loading && <ActivityIndicator size="small" color="#0000ff" /> }</View> }
				/>
			</View>
		);
	}
}
