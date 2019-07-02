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

import PortailApi from '../../services/Portail';
import ActualitesUTC from '../../services/ActualitesUTC';
import ArticleComponent from '../../components/Articles/Article';
import FakeItem from '../../components/FakeItem';
import styles from '../../styles';
import { stringDate } from '../../utils/Generate';
import { _, e } from '../../utils/i18n';

// seuil qui définit le chargement de nouveaux articles : si THRESHOLD = 0.1 alors on commence à charger de nouveaux articles quand on atteint les 10 derniers pourcents
const THRESHOLD = 0.4;
const MAX_PER_PAGE = 50;
const MAX_DAYS = 7;

export default class Articles extends React.Component {
	static navigationOptions = () => ({
		title: _('actualities'),
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	});

	static sortArticles(a, b) {
		let aDate;
		let bDate;

		if (a.article_type === ArticleComponent.PORTAIL_ARTICLE_TYPE) {
			aDate = new Date(a.created_at);
		} else {
			aDate = new Date(a.date);
		}

		if (b.article_type === ArticleComponent.PORTAIL_ARTICLE_TYPE) {
			bDate = new Date(b.created_at);
		} else {
			bDate = new Date(b.date);
		}

		return aDate.getTime() < bDate.getTime();
	}

	constructor(props) {
		super(props);

		const date = new Date();
		date.setDate(date.getDate() - MAX_DAYS);

		this.willUnmount = false;
		this.state = {
			date,
			noArticlesCounter: 0,
			articles: [],
			portailArticles: [],
			utcArticles: [],
			filters: [
				{ displayName: _('all'), filterTag: 'all' },
				{ displayName: _('utc'), filterTag: ArticleComponent.UTC_ARTICLE_TYPE },
				{ displayName: _('associations'), filterTag: ArticleComponent.PORTAIL_ARTICLE_TYPE },
			],
			selectedFilterIndex: 0,
			loading: false,
			search: '',
		};
	}

	componentDidMount() {
		this.loadMoreContent();
	}

	componentWillUnmount() {
		this.willUnmount = true;
	}

	loadPortailArticles(page = 0) {
		const { date } = this.state;

		return PortailApi.getArticles(MAX_PER_PAGE, page, 'latest', date.getTime()).then(
			([articles]) => {
				articles.map(article => {
					article.article_type = ArticleComponent.PORTAIL_ARTICLE_TYPE;
					article.created_at = article.created_at.replace(' ', 'T');

					return article;
				});

				this.setState(prevState => ({
					...prevState,
					portailArticles: prevState.portailArticles.concat(articles),
				}));

				// Si on a chargé le maximum d'articles par page, on suppose qu'il en reste.
				if (articles.length === MAX_PER_PAGE) {
					return MAX_PER_PAGE + this.loadPortailArticles(page + 1);
				}

				// Tout a été chargé pour la semaine demandée.
				return articles.length;
			}
		);
	}

	loadUTCArticles(page = 1) {
		const { date } = this.state;
		const beforeDate = new Date(date);
		beforeDate.setDate(beforeDate.getDate() + MAX_DAYS);

		const queries = {
			per_page: MAX_PER_PAGE,
			page,
			before: stringDate(beforeDate),
			after: stringDate(date),
		};

		return ActualitesUTC.getArticles(queries).then(([articles]) => {
			articles.map(article => {
				article.article_type = ArticleComponent.UTC_ARTICLE_TYPE;

				return article;
			});

			this.setState(prevState => ({
				...prevState,
				portailArticles: prevState.portailArticles.concat(articles),
			}));

			// Si on a chargé le maximum d'articles par page, on suppose qu'il en reste.
			if (articles.length === MAX_PER_PAGE) {
				return MAX_PER_PAGE + this.loadUTCArticles(page + 1);
			}

			return articles.length;
		});
	}

	loadMoreContent() {
		const { loading } = this.state;

		// On fait bien attention à ne pas demander de charger plusieurs fois en même temps.
		if (loading || this.willUnmount) {
			return;
		}

		const promises = [];

		if (ActualitesUTC.isConnected()) {
			const UTCPromise = this.loadUTCArticles();

			promises.push(UTCPromise);
		}

		if (PortailApi.isConnected()) {
			const PortailPromise = this.loadPortailArticles();

			promises.push(PortailPromise);
		}

		if (promises.length) {
			this.setState({ loading: true });

			new Promise.all(promises).then(nbrNewArticles => {
				const { noArticlesCounter, date } = this.state;
				const sumNbr = nbrNewArticles.reduce((acc, val) => acc + (val || 0), 0);
				date.setDate(date.getDate() - MAX_DAYS);

				// On a chargé aucun nouvel article, chargeons pour les dates suivantes.
				if (sumNbr === 0) {
					// Eviter le chargement infini.
					if (noArticlesCounter < 5) {
						return this.setState(
							prevState => ({
								...prevState,
								loading: false,
								noArticlesCounter: prevState.noArticlesCounter + 1,
							}),
							() => this.loadMoreContent()
						);
					}
				}

				this.setState(prevState => {
					return {
						...prevState,
						articles: prevState.articles
							.concat(prevState.portailArticles, prevState.utcArticles)
							.sort(Articles.sortArticles),
						portailArticles: [],
						utcArticles: [],
						loading: false,
						noArticlesCounter: 0,
					};
				});
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
		const { articles, utcArticles, portailArticles, filters, selectedFilterIndex } = this.state;

		const newArticles = [].concat(portailArticles, utcArticles).sort(Articles.sortArticles);
		const resultedArticles = [].concat(articles, newArticles);

		const filteredArticles =
			selectedFilterIndex === 0
				? resultedArticles
				: resultedArticles.filter(
						article => article.article_type === filters[selectedFilterIndex].filterTag
				  );

		// TODO: filtrer en fonction de la recherche (barre de recherche dans this.renderSearchBar

		return (
			<FlatList
				style={styles.scrollable.list}
				data={filteredArticles}
				renderItem={item => <ArticleComponent data={item} navigation={navigation} />}
				ItemSeparatorComponent={() => <View style={styles.scrollable.sectionSeparator} />}
				onEndReached={() => this.loadMoreContent()}
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
