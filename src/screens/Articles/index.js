import React from 'react';
import {FlatList, Text, View} from 'react-native';
import styles from '../../styles'

import Portail from '../../services/Portail';
import ArticleComponent from '../../components/Articles/Article';

const DEFAULT_ARTICLES_PAGINATION = 6;
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
		if(!Portail.isConnected()) {throw 'Attempted to fetch articles but portail not connected.';}
		this.state = {
			page:0,
			pagination:DEFAULT_ARTICLES_PAGINATION,
			canLoadMoreContent: true,
			networkOk: true,
			data: [],
			isLoading: false,
		};
		this.data = [];
		this.props.articleHeight = 100;
		
	}

	componentDidMount(){
		this._loadMoreContentAsync();
	}

	_loadMoreContentAsync = async () => {
		if(!this.state.canLoadMoreContent) {return;}
		
		this.setState(prevState => ({ ...prevState, isLoading: true, networkOk: true}));
		try {
		let today = new Date("2018-07-19T14:32:34"); //TODO normalement il faudra récupérer ce paramètre du component de filtrage
		var newdata = await Portail.getArticles(this.state.pagination, this.state.page + 1, 'oldest', today, false, true, true);
		//truc chelou : comme la liste est 'à l'endoit' (le premier élément de l'array est en haut, le dernier est en bas), si on veut un scroll à la facebook avec l'élément le plus récent (le dernier en date) en haut (le premier de l'array), il faut faire un "oldest", et à l'inverse, si on veut les trucs les plus vieux en premier, il faut un latest
		newdata = newdata[0]; //parce qu'on reçoit [response, status]
		if (newdata.length < this.state.pagination) {this.setState(prevState => ({ ...prevState, canLoadMoreContent: false }));}
		this.data = this.data.concat(newdata);
		
		this.setState(prevState => ({ ...prevState, page: prevState.page + 1 }));
		//il est nécessaire d'effectuer l'inversion en tout dernier, juste avant la mise à jour de l'état, pour que les nouvelles données soient inversées comme les vielles, en gardant l'ordre
		//il est nécessaire d'effectuer cette instruction en dernier et séparément des autres car le setstate est async
		this.setState(prevState => ({ ...prevState, data: this.data }));
		}

		catch (e) {/**
			switch (status) {
				case 416:
					this.setState(prevState => ({ ...prevState, canLoadMoreContent: false }));
					break;
				case 523:
				default:
					this.setState(prevState => ({ ...prevState, networkOk: false }));
					break;
			}**/ console.warn(e);
			
		}
	}

	

	render() {
		return (<View style={styles.article.articlesFeedContainer}>
				<FlatList
					data={this.state.data}
					renderItem={({item}) => <ArticleComponent data={item} />}
					onEndReached={this._loadMoreContentAsync}
					onEndReachedThreshold = {THRESHOLD}
					keyExtractor={ (item) => item["id"].toString()}
					ListFooterComponent = {<View style={styles.article.loadingIndicatorContainer}><Text style={styles.article.loadingIndicatorText}>Chargement... {!this.state.networkOk && "Samy, ça marche pas!"} {!this.state.canLoadMoreContent && 'Y\'en a plus!'}</Text></View>}
				/>
			</View>
		);

		
	}
}
