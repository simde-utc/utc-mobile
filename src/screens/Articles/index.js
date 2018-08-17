import React from 'react';
import {FlatList} from 'react-native';
// import styles from '../../styles'

import Portail from '../../services/Portail';
import ArticleComponent from '../../components/Articles/Article';

const DEFAULT_ARTICLES_PAGINATION = 3;

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
			page:1,
			pagination:DEFAULT_ARTICLES_PAGINATION,
			canLoadMoreContent: true,
			networkOk: true
		};
		
	}

	componentDidMount(){
		this._loadMoreContentAsync();
	}

	_loadMoreContentAsync = async () => {
		try {
		this.setState(prevState => ({ ...prevState, networkOk: true}));
		console.log("loading data");
		var newdata = await Portail.getArticles(this.state.pagination, this.state.page + 1);
		console.log("data loaded");
		this.data = this.data.concat(newdata);
		
		this.setState(prevState => ({ ...prevState, page: prevState.page + 1 }));
		this.setState(prevState => ({ ...prevState, data: this.data }));
		}

		catch ([response, status]) {
			switch (status) {
				case 416:
					this.setState(prevState => ({ ...prevState, canLoadMoreContent: false }));
					console.log(response);
					break;
				case 523:
				default:
					this.setState(prevState => ({ ...prevState, networkOk: false }));
					console.warn(response, status);
					break;
			}
		}
	}

	

	render() {
		return (
			<FlatList
				data={this.state.data}
				renderItem={({item}) => <Article data={item} />}
			/>
		);

		
	}
}
