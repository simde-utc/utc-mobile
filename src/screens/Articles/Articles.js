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

	constructor(props) {
		super(props);

		const date = new Date();
		date.setDate(date.getDate() - MAX_DAYS);

		this.willUnmount = false;
		this.state = {
			date,
			portailArticles: [],
			utcArticles: [],
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
		this.loadMoreContent();
	}

	componentWillUnmount() {
		this.willUnmount = true;
	}

	loadPortailArticles(page = 0) {
		const { date } = this.state;

		return PortailApi.getArticles(MAX_PER_PAGE, page, 'latest', date.getTime()).then(([articles]) => {
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
		});
	}

	loadUTCArticles(page = 0) {
		// const { date } = this.state;
		//
		// return CASAuth.getService(ACTUS_UTC_FEED_LOGIN)
		// 	.then(([serviceTicket]) => {
		// 		const actus = new ActualitesUTC(serviceTicket);
		//
		// 		return actus
		// 			.loadArticles()
		// 			.then(() => {
		// 				return actus.getArticles(pagination, page + 1, 'latest').map(article => {
		// 					article.article_type = 'utc';
		//
		// 					return article;
		// 				});
		// 			})
		// 			.catch(([response, status]) => {
		// 				console.log([response, status]);
		//
		// 				if (this.willUnmount) {
		// 					return;
		// 				}
		// 				switch (status) {
		// 					case 416:
		// 						this.setState(prevState => ({ ...prevState, canLoadMoreUTCArticles: false }));
		// 						break;
		// 					case 523:
		// 					default:
		// 						// TODO: afficher réseau ou inconnue
		// 						console.warn([response, status]);
		// 						this.setState(prevState => ({ ...prevState, canLoadMoreUTCArticles: false }));
		// 						break;
		// 				}
		//
		// 				return [];
		// 			});
		// 	})
		// 	.catch(() => {
		// 		return [];
		// 	});
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

			return new Promise.all(promises)
				.then(nbrNewArticles => {
					this.setState(prevState => {
						prevState.date.setDate(prevState.date.getDate() - MAX_DAYS);

						return {
							...prevState,
							loading: false
						};
					}, () => {
						const sumNbr = nbrNewArticles.reduce((acc, val) => acc + (val || 0), 0);

						// On a chargé aucun nouvel article, chargeons pour les dates suivantes.
						if (sumNbr === 0) {
							this.loadMoreContent();
						}
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
		const { portailArticles, utcArticles, filters, selectedFilterIndex } = this.state;
		const articles = [].concat(portailArticles, utcArticles);

		// console.log(portailArticles, utcArticles);

		const filteredArticles = selectedFilterIndex === 0 ? articles : articles.filter(
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
