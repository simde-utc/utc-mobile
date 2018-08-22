import React from 'react';
import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import styles from '../../styles'

import CASAuth from '../../services/CASAuth';
import Portail from '../../services/Portail';

import ArticleComponent from '../../components/Articles/Article';

const DEFAULT_ARTICLES_PAGINATION = 25;
//seuil qui définit le chargement de nouveaux articles : si THRESHOLD = 0.1 alors on commence à charger de nouveaux articles quand on atteint les 10 derniers pourcents
const THRESHOLD = 0.2;

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
			this.flatList.scrollToEnd()

			return new Promise.all(promises).then(([articles, articles2]) => {
				this.setState(prevState => ({ ...prevState, loading: false }))

				if (!articles)
					return

				if (articles2)
					articles.concat(articles2)

				console.log(articles)

				// Il faut trier
				this.setState(prevState => {
					prevState.page++
					prevState.articles = prevState.articles.concat(articles)

					return prevState
				})
			}).catch(() => { this.setState(prevState => ({ ...prevState, loading: false })) })
		}
	}

	_loadUTCArticles() {
		return CASAuth.getService(process.env.ACTUS_UTC_FEED_LOGIN).then(([serviceTicket]) => {
			var actus = new ActualitesUTC(serviceTicket)

			return actus.loadArticles().then(() => {
				resolve([actus.getArticles(paginate, page, order, week), 200])
			}).catch(([response, status]) => {
				this.setState(prevState => ({ ...prevState, canLoadMoreUTCArticles: false }))
			})
		})
	}

	_loadPortailArticles() {
		return Portail.getArticles(this.state.pagination, this.state.page + 1, 'latest').then(([response, status]) => {
			return response
		}).catch(([response, status]) => {
			if (status === 416)
				this.setState(prevState => ({ ...prevState, canLoadMorePortailArticles: false }))
		})
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
