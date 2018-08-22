import React from 'react';
import {FlatList, Text, View} from 'react-native';
import styles from '../../styles'

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
			canLoadMoreContent: true,
			articles: [],
			isLoading: false,
		};

		this.props.articleHeight = 100;
	}

	componentDidMount() {
		this._loadMoreContentAsync()
	}

	_loadMoreContentAsync() {
		if (!this.state.canLoadMoreContent) return

		this.setState(prevState => ({ ...prevState, isLoading: true }))

		Portail.getArticles(this.state.pagination, this.state.page + 1, 'latest').then(([response, status]) => {
			this.setState(prevState => {
				prevState.page++
				prevState.articles = prevState.articles.concat(response)

				return prevState
			})
		}).catch(([response, status]) => {
			if (status === 416)
				this.setState(prevState => ({ ...prevState, canLoadMoreContent: false }))
		})
	}



	render() {
		return (<View style={styles.article.articlesFeedContainer}>
				<FlatList
					data={this.state.articles}
					renderItem={({item}) => <ArticleComponent data={item} />}
					onEndReached={ this._loadMoreContentAsync.bind(this) }
					onEndReachedThreshold = {THRESHOLD}
					keyExtractor={ (item) => item["id"].toString()}
					ListFooterComponent = {<View style={styles.article.loadingIndicatorContainer}><Text style={styles.article.loadingIndicatorText}>{!this.state.canLoadMoreContent && 'Y\'en a plus!'}</Text></View>}
				/>
			</View>
		);
	}
}
