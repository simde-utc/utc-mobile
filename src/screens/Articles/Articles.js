/*
 * Récupère et affiche la liste des actualités (UTC et associatives).
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license AGPL-3.0
 */

import React from 'react';
import { FlatList, View, Platform, SearchBar } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import CASAuth from '../../services/CASAuth';
import PortailApi from '../../services/Portail';
import ActualitesUTC from '../../services/ActualitesUTC';
import ArticleComponent from '../../components/Articles/Article';
import FakeItem from '../../components/FakeItem';
import { ACTUS_UTC_FEED_LOGIN } from '../../../config';
import styles from '../../styles';
import { _, e } from '../../utils/i18n';

const DEFAULT_ARTICLES_PAGINATION = 6; // debug pour bien vérifier le chargement en plusieurs fois
// seuil qui définit le chargement de nouveaux articles : si THRESHOLD = 0.1 alors on commence à charger de nouveaux articles quand on atteint les 10 derniers pourcents
const THRESHOLD = 0.4;

export default class ArticlesScreen extends React.Component {
	static navigationOptions = () => ({
		title: _('actualities'),
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	});

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
				{ displayName: _('all'), filterTag: 'all' },
				{ displayName: _('utc'), filterTag: 'utc' },
				{ displayName: _('associations'), filterTag: 'assos' },
			],
			selectedFilterIndex: 0,
			loading: false,
			search: '',
		};
	}

	componentDidMount() {
		this.loadMoreContentAsync();
	}

	componentWillUnmount() {
		this.willUnmount = true;
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

	renderFilters() {
		const { selectedFilterIndex, filters } = this.state;

		if (filters.length <= 0) {
			throw e('no_filters');
		}

		return (
			<View
				style={{
					padding: 10,
					backgroundColor: '#fff',
					borderBottomWidth: 1,
					borderBottomColor: '#f1f1f1',
				}}
			>
				<SegmentedControlTab
					tabStyle={{ backgroundColor: 'transparent', borderColor: '#007383' }}
					tabTextStyle={{ color: '#007383' }}
					activeTabStyle={{ backgroundColor: '#007383' }}
					values={filters.map(filter => filter.displayName)}
					selectedIndex={selectedFilterIndex}
					onTabPress={index => {
						this.setState({ selectedFilterIndex: index });
					}}
				/>
			</View>
		);
	}

	renderSearchBar() {
		const { search } = this.state;

		return (
			<SearchBar
				placeholder={_('search')}
				platform={Platform.OS}
				value={search}
				onChangeText={search => this.setState({ search })}
				lightTheme
				containerStyle={{ backgroundColor: '#fff' }}
				inputContainerStyle={{ backgroundColor: '#f4f4f4' }}
				cancelButtonTitle={_('cancel')}
				cancelButtonProps={{ buttonTextStyle: { color: '#007383' } }}
				round
			/>
		);
	}

	render() {
		const { navigation } = this.props;
		const { articles, filters, selectedFilterIndex } = this.state;

		const filteredArticles =
			selectedFilterIndex === 0
				? articles
				: articles.filter(
						article => article.article_type === filters[selectedFilterIndex].filterTag
				  );

		// TODO: filtrer en fonction de la recherche (barre de recherche dans this.renderSearchBar

		return (
			<FlatList
				style={styles.scrollable.list}
				data={filteredArticles}
				renderItem={item => (
					<ArticleComponent data={item} navigation={navigation} portailInstance={PortailApi} />
				)}
				ItemSeparatorComponent={() => <View style={styles.scrollable.sectionSeparator} />}
				onEndReached={this.loadMoreContentAsync.bind(this)}
				onEndReachedThreshold={THRESHOLD}
				keyExtractor={article => `${article.article_type}_${article.id}`}
				ListHeaderComponent={this.renderFilters()}
				ListFooterComponent={
					<View>
						{filteredArticles.length > 0 ? (
							<View style={styles.scrollable.sectionSeparator} />
						) : null}
						<FakeItem title={_('loading')} />
					</View>
				}
			/>
		);
	}
}
