import React from 'react';
import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import { ACTUS_UTC_FEED_LOGIN } from 'react-native-dotenv'
import styles from '../../styles'

import CASAuth from '../../services/CASAuth';
import Portail from '../../services/Portail';
import ActualitesUTC from '../../services/ActualitesUTC';

import Generate from '../../utils/Generate'

import Filter from '../../components/Filter';
import ArticleComponent from '../../components/Articles/Article';
import fullArticleScreen from './fullArticle';
import {createStackNavigator} from 'react-navigation';

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

	componentWillUnmount() {
		this.willUnmount = true;
	}

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
					filter: function(article) {return article['article_type'] == this.id},
					conflict: []
				},
				{
					id: 'assos',
					name: 'assos',
					filter: function(article) {return article['article_type'] == this.id},
					conflict: ['fav']
				},
				{
					id: 'fav',
					name: 'favoris',
					favoris: [],
					filter: function(article) {
						return article['article_type']=='assos' && (article['owned_by'] && this.favoris.includes(article['owned_by']['id']))
					},
					conflict: ['assos']
				},
			].reduce((acc, val)=>{
				acc[val.id]=val
				return acc
			}, {}),
			selectedFilters: [],
			loading: false,
			search: '',
		};
		Portail.getUserAssos().then( (assos) => {
			this.setState((prevState) => {
				for(let asso of assos)
					prevState.filters['fav'].favoris.push(asso['id'])
				return prevState
			})
		});
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
		if(this.willUnmount) {return;} //à tester avant chaque setstate pour éviter les re-render inutiles et les "memory leaks" (d'après expo). Si on avait une biblio de gestion de l'état on aurait pas besoin de faire ça
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

		if(this.willUnmount) {return;}
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
				if(this.willUnmount) {return;}
				this.setState(prevState => {
					prevState.page++;
					return prevState;
				},
				() => {
					//il faut être sûr d'incrémenter la pagination avant d'autoriser le chargement de nouveaux articles
					if(this.willUnmount) {return;}
					this.setState( prevState => {
						prevState.articles = prevState.articles.concat(articles);
						prevState.loading = false;
						return prevState;
					});
				});
			}).catch((e) => {console.warn(e); if(this.willUnmount) {return;} this.setState(prevState => ({ ...prevState, loading: false })) })
		}
	}

	_loadUTCArticles() {
		return CASAuth.getService(ACTUS_UTC_FEED_LOGIN).then(([serviceTicket]) => {
			var actus = new ActualitesUTC(serviceTicket)

			return actus.loadArticles().then(() => {
				return actus.getArticles(this.state.pagination, this.state.page + 1, 'latest').map((article) => {
					article['article_type'] = 'utc'

					return article
				})
			}).catch(([response, status]) => {
				if(this.willUnmount) {return;}
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
			if(this.willUnmount) {return;}
			if (status === 416)
				this.setState(prevState => ({ ...prevState, canLoadMorePortailArticles: false }))

			return []
		})
	}

	unselectFilter(name) {
		if(this.willUnmount) {return;}
		this.setState(prevState => {
			if (prevState.selectedFilters.length === 1 && prevState.selectedFilters.includes(name))
				return prevState

			var index = prevState.selectedFilters.indexOf(name)

			if (index > -1)
				prevState.selectedFilters.splice(index, 1)

			return prevState
		})
	}

	onlySelectFilter(name) {
		if(this.willUnmount) {return;}
		this.setState(prevState => {
			prevState.selectedFilters = [name]

			return prevState
		})
	}

	selectFilter(name) {
		if(this.willUnmount) {return;}
		this.setState(prevState => {
			for(let conflict of prevState.filters[name].conflict){
				var index = prevState.selectedFilters.indexOf(conflict)

				if (index > -1)
					prevState.selectedFilters.splice(index, 1)
			}
			prevState.selectedFilters.push(name)

			return prevState
		})
	}

	onSearchTextChange(text) {
		text = Generate.searchText(text)
		this.setState((prevState) => {
			prevState.search = text

			return prevState
		})

		return text
	}

	render() {
		const toMatch = this.state.search.toLowerCase().split(' ')

		const data = this.state.articles.filter((article) => {
			//if (!this.state.selectedFilters.includes(article['article_type']))
			//	return false
			filtered = true;
			for(let fl of this.state.selectedFilters){
				if(this.state.filters[fl].filter(article) ){
					filtered = false
					break
				}
			}
			if(filtered)
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
					filters={ Object.values(this.state.filters) }
					selectedFilters={ this.state.selectedFilters }
					onFilterUnselected={ this.unselectFilter.bind(this) }
					onFilterSelected={ this.selectFilter.bind(this) }
					onFilterLongPressed={ this.onlySelectFilter.bind(this) }
					searchButton={ false }
					onSearchTextChange={ this.onSearchTextChange.bind(this) }
				/>
				<FlatList
					ref={(component) => ( this.flatList = component )}
					data={ data }
					renderItem={({item}) => <ArticleComponent navigation={this.props.navigation} data={item} portailInstance={Portail} fullActions={true} /> }
					onEndReached={ this._loadMoreContentAsync.bind(this) }
					onEndReachedThreshold = {THRESHOLD}
					keyExtractor={ (article) => article['article_type'] + '_' + article['id'] }
					ListFooterComponent = { <View style={ styles.article.loadingIndicatorContainer }>{ this.state.loading && <ActivityIndicator size="small" color="#0000ff" /> }</View> }
				/>
			</View>
		);
	}
}
