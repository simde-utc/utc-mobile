import React from 'react';
import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import styles from '../../styles'

import CASAuth from '../../services/CASAuth';
import Portail from '../../services/Portail';

import ActualitesUTC from '../../services/ActualitesUTC';

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
			loading: false,
		};

		this.props.articleHeight = 100;
	}

	componentDidMount() {
		this._loadMoreContentAsync()
	}

	_loadMoreContentAsync() {
		if (!this.state.canLoadMorePortailArticles) return

		var promises = []
	

		if(this.state.loading) {return;} //pas de requête doublon

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

				if (!(articles || articles2)) {return;}
				if (articles && articles2) {
					articles2.forEach(this._normalizePortailArticle);
					articles = articles.concat(articles2);
				}					
				else {
					articles = articles || articles2;}

				articles.sort(this._compArtDate);
				articles.reverse(); //parce qu'on veut les plus récents en haut

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

		return new Promise((resolve, reject) => {
			CASAuth.getService(process.env.ACTUS_UTC_FEED_LOGIN).then(([serviceTicket]) => {
				var actus = new ActualitesUTC(serviceTicket)

				return actus.loadArticles().then(() => {
					resolve(actus.getArticles(this.state.pagination, this.state.page + 1, 'latest'))
				}).catch(([response, status]) => {
					switch(status) {
						case 416:
							this.setState(prevState => ({ ...prevState, canLoadMoreUTCArticles: false }));
							break;
						case 523:
						default:
							//TODO: afficher réseau ou inconnue
							console.warn([response, status]);
							this.setState(prevState => ({ ...prevState, canLoadMoreUTCArticles: false }));
							break;
					}
							
				})
			});
		});

	}

	_loadPortailArticles() {
		return Portail.getArticles(this.state.pagination, this.state.page + 1, 'latest').then(([response, status]) => {
			return response
		}).catch(([response, status]) => {
			if (status === 416)
				this.setState(prevState => ({ ...prevState, canLoadMorePortailArticles: false }))

			return []
		})
	}


	//pure helpers

	_normalizePortailArticle(article) {
		article["created_at"] = article["created_at"].replace(' ', 'T');
	}

	_compArtDate(a,b) {
	var dateA = new Date(a.created_at || a.date_gmt); var dateB = new Date(b.created_at || b.date_gmt);
	  if (dateA < dateB)
	    return -1;
	  if (dateA > dateB)
	    return 1;
	  return 0;
	}

	render() {
		return (<View style={styles.article.articlesFeedContainer}>
				<FlatList
					ref={(component) => ( this.flatList = component )}
					data={this.state.articles}
					renderItem={({item}) => <ArticleComponent data={item} />}
					onEndReached={ this._loadMoreContentAsync.bind(this) }
					onEndReachedThreshold = {THRESHOLD}
					keyExtractor={ (item) => item["id"].toString()}
					ListFooterComponent = {<View style={ styles.article.loadingIndicatorContainer }>{ this.state.loading && <ActivityIndicator size="small" color="#0000ff" /> }</View>}
				/>
			</View>
		);
	}
}
