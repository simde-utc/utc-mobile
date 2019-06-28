import React from 'react';
import { View, Dimensions, Image } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import ArticleComponent from '../Articles/Article';
import PortailApi from '../../services/Portail';
import ActualitesUTC from '../../services/ActualitesUTC';
import styles from '../../styles';
import { normalizeArticle } from '../../utils/Generate';

const NBR_OF_NEW_PORTAIL_ARTICLES = 3;
const NBR_OF_LIKED_PORTAIL_ARTICLES = 3;
const NBR_OF_NEW_UTC_ARTICLES = 4;
const RANGE_DATE = 7;
const HEIGHT_NEWS = 175;
const WIDTH_MULTIPLICATOR_NEWS = 0.9;

const sliderWidth = Dimensions.get('window').width;
export default class ArticlesCaroussel extends React.Component {
	static articleFromPortail = article => {
		article.article_type = ArticleComponent.PORTAIL_ARTICLE_TYPE;

		return article;
	};

	constructor(props) {
		super(props);

		this.state = {
			news: [],
			liked: [],
			utc: [],
			activeDot: 0,
		};

		const date = new Date();
		date.setDate(date.getDate() - RANGE_DATE);

		PortailApi.getArticles(NBR_OF_NEW_PORTAIL_ARTICLES, 0, 'latest').then(([articles]) => {
			this.setState({
				news: articles.map(ArticlesCaroussel.articleFromPortail),
			});
		});

		PortailApi.getArticles(NBR_OF_LIKED_PORTAIL_ARTICLES, 0, 'liked', date.getTime()).then(
			([articles]) => {
				this.setState({
					liked: articles.map(ArticlesCaroussel.articleFromPortail),
				});
			}
		);

		ActualitesUTC.getArticles({ per_page: NBR_OF_NEW_UTC_ARTICLES }).then(([articles]) => {
			this.setState({
				utc: articles.map(article => normalizeArticle(article)),
			});
		});
	}

	getImageFromArticle(article) {
		if (article.article_type === ArticleComponent.PORTAIL_ARTICLE_TYPE) {
			return article.image || article.owned_by.image;
		}
	}

	renderItem(article) {
		return (
			<View style={{ height: HEIGHT_NEWS, backgroundColor: 'white' }}>
				<Image resizeMode="contain" style={{ height: HEIGHT_NEWS }} source={{ uri: this.getImageFromArticle(article) }} />
			</View>
		);
	}

	getArticles() {
		const { news, liked, utc } = this.state;

		return [].concat(news, liked, utc);
	}

	getNbrArticles() {
		const { news, liked, utc } = this.state;

		return news.length + liked.length + utc.length;
	}

	render() {
		const { activeDot } = this.state;

		return (
			<View>
				<Carousel
					data={this.getArticles()}
					renderItem={item => this.renderItem(item.item)}
					sliderWidth={sliderWidth}
					itemWidth={sliderWidth * WIDTH_MULTIPLICATOR_NEWS}
					onSnapToItem={activeDot => this.setState({ activeDot })}
				/>
				<Pagination
					dotsLength={this.getNbrArticles()}
					activeDotIndex={activeDot}
					containerStyle={{ paddingVertical: 10 }}
					dotStyle={styles.bg.lightBlue}
					inactiveDotStyle={styles.bg.gray}
				/>
			</View>
		);
	}
}
