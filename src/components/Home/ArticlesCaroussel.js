import React from 'react';
import { View, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import PortailApi from '../../services/Portail';

const NBR_OF_NEW_PORTAIL_ARTICLES = 3;
const NBR_OF_LIKED_PORTAIL_ARTICLES = 3;
const NBR_OF_NEW_UTC_ARTICLES = 4;
const RANGE_DATE = 7;

const sliderWidth = Dimensions.get('window').width;
export default class ArticlesCaroussel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			news: [],
			liked: [],
			utc: [],
		};

		const date = new Date();
		date.setDate(date.getDate() - RANGE_DATE);

		// PortailApi.getArticles(NBR_OF_NEW_PORTAIL_ARTICLES, 0, 'latest', date.getTime())
		PortailApi.getArticles(NBR_OF_NEW_PORTAIL_ARTICLES, 0, 'latest')
			.then(([data]) => {
				this.setState({
					news: data
				})
			});

		PortailApi.getArticles(NBR_OF_LIKED_PORTAIL_ARTICLES, 0, 'liked', date.getTime())
			.then(([data]) => {
				this.setState({
					liked: data
				})
			});
	}

	renderItem(item) {
		console.log(item);

		return (
			<View style={{ height: 150, backgroundColor: 'black'}}>
			</View>
		);
	}

	getArticles() {
		const { news, liked, utc } = this.state;

		return [].concat(news, liked, utc);
	}

	render() {
		return (
			<Carousel
				data={this.getArticles()}
				renderItem={item => this.renderItem(item)}
				sliderWidth={sliderWidth}
				itemWidth={sliderWidth * 80 / 100}
			/>
		);
	}
};
