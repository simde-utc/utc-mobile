import React from 'react';
import {FlatList} from 'react-native';
// import styles from '../../styles'

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
		};
		this.data = [];
		this.props.articleHeight = 100;
		
	}

	componentDidMount(){
		this._loadMoreContentAsync();
	}

	_loadMoreContentAsync = async () => {
		try {
		this.setState(prevState => ({ ...prevState, networkOk: true}));
		var newdata = await Portail.getArticles(this.state.pagination, this.state.page + 1);
		newdata = newdata[0].map( (elmt) => {return {key: elmt["id"], article:elmt};});
		if (newdata.length < this.state.pagination) {this.setState(prevState => ({ ...prevState, canLoadMoreContent: false }));}
		this.data = this.data.concat(newdata);
		
		this.setState(prevState => ({ ...prevState, page: prevState.page + 1 }));
		//il est nécessaire d'effectuer cette instruction en dernier et séparément des autres car le setstate est async
		this.setState(prevState => ({ ...prevState, data: this.data }));
		}

		catch ([response, status]) {
			switch (status) {
				case 416:
					this.setState(prevState => ({ ...prevState, canLoadMoreContent: false }));
					break;
				case 523:
				default:
					this.setState(prevState => ({ ...prevState, networkOk: false }));
					break;
			}
			
		}
	}

	

	render() {
		return (
			<FlatList
				data={this.state.data}
				renderItem={({item}) => <ArticleComponent data={item} />}
				onEndReached={this._loadMoreContentAsync}
				onEndReachedThreshold = {THRESHOLD}
			/>
		);

		
	}
}
