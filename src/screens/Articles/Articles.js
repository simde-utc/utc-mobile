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

import store from "../../redux/store";
import { addPortailArticle, addUTCArticle } from "../../redux/actions/index";
import { connect } from "react-redux";

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

		//dirty way of characterising a UTC article
		if (a.author) {
			aDate = new Date(a.date);
		} else {
			aDate = new Date(a.created_at);
		}

		if (b.author) {
			bDate = new Date(b.date);
		} else {
			bDate = new Date(b.created_at);
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

				articles.forEach( article => {
				let formattedArticle = Object.assign({}, article);
				formattedArticle.created_at = article.created_at.replace(' ', 'T');
				store.dispatch( addPortailArticle(article) );
				});


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
			articles.forEach(article => {
				store.dispatch( addUTCArticle(article));
			});

			// Si on a chargé le maximum d'articles par page, on suppose qu'il en reste.
			if (articles.length === MAX_PER_PAGE) {
				return MAX_PER_PAGE + this.loadUTCArticles(page + 1);
			}

			return articles.length;
		});
	}

	loadMoreContent() {
		const { selectedFilterIndex } = this.state;

		// Do not launch network I/O while react is trying to kill the component
		if (this.willUnmount) {
			return;
		}

		const promises = [];

		if (ActualitesUTC.isConnected() && (selectedFilterIndex == 0 || selectedFilterIndex == 1)) {
			const UTCPromise = this.loadUTCArticles();
			promises.push(UTCPromise);
		}

		if (PortailApi.isConnected() && (selectedFilterIndex == 0 || selectedFilterIndex == 2)) {
			const PortailPromise = this.loadPortailArticles();
			promises.push(PortailPromise);
		}

		if (promises.length != 0) {
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
		const { filters, selectedFilterIndex } = this.state;

		const mapStateToProps = state => {
			switch(selectedFilterIndex) {
				case 1:
					return {articles: Array.from(state.UTCArticles.values()).filter(elmt => elmt !== undefined)};
				case 2:
					return {articles: Array.from(state.portailArticles.values()).filter(elmt => elmt !== undefined)};
				default:
					return {articles: Array.from(state.portailArticles.values()).concat(Array.from(state.UTCArticles.values())).sort(this.sortArticles).filter(elmt => elmt !== undefined)};
			}
		}

		// TODO: filtrer en fonction de la recherche (barre de recherche dans this.renderSearchBar

		const FList = ({articles}) => (
			<FlatList
				style={styles.scrollable.list}
				data={articles}
				renderItem={item => <ArticleComponent data={item} navigation={navigation} />}
				ItemSeparatorComponent={() => <View style={styles.scrollable.sectionSeparator} />}
				onEndReached={() => this.loadMoreContent()}
				onEndReachedThreshold={THRESHOLD}
				keyExtractor={article => {return `${article.id}`}}
				ListHeaderComponent={this.renderFilters()}
				ListFooterComponent={
					<View>
						{articles.length > 0 ? (
							<View style={styles.scrollable.sectionSeparator} />
						) : null}
						<FakeItem title={_('loading')} />
					</View>
				}
			/>);
		ConnectedFList = connect(mapStateToProps)(FList);
		return (<ConnectedFList />);
	}
}
