import React from 'react';
import { TouchableHighlight, View, Dimensions, Image } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import TextTicker from 'react-native-text-ticker';

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
	static articleFromPortail(article) {
		article.article_type = ArticleComponent.PORTAIL_ARTICLE_TYPE;

		return article;
	}

	constructor(props) {
		super(props);

		this.state = {
			news: [],
			liked: [],
			utc: [],
			utcImages: [],
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
				utc: articles.map(article => {
					article = normalizeArticle(article);

					ActualitesUTC.getImageFromMedia(article.featured_media).then(image => {
						console.log(image);
						this.setState(prevState => {
							prevState.utcImages[article.id] = image;

							return prevState;
						});
					});

					return article;
				}),
			});
		});
	}

	getImageFromArticle(article) {
		if (article.article_type === ArticleComponent.PORTAIL_ARTICLE_TYPE) {
			return article.image || article.owned_by.image;
		}
		const { utcImages } = this.state;

		return utcImages[article.id];
	}

	getArticles() {
		const { news, liked, utc } = this.state;

		return [].concat(news, liked, utc);
	}

	getNbrArticles() {
		const { news, liked, utc } = this.state;

		return news.length + liked.length + utc.length;
	}

	showArticle(article) {
		const { navigation } = this.props;

		navigation.navigate('fullArticle', {
			title: article.title,
			article: { item: article },
			navigation,
		});
	}

	renderArticle(article) {
		return (
			<TouchableHighlight
				style={{ height: HEIGHT_NEWS, backgroundColor: 'white' }}
				onPress={() => this.showArticle(article)}
			>
				<View>
					<Image
						resizeMode="contain"
						style={{ height: HEIGHT_NEWS - 27 }}
						source={{ uri: this.getImageFromArticle(article) }}
					/>
					<View style={{ justifyContent: 'center', alignItems: 'center' }}>
						<TextTicker
							style={{ margin: 5, marginBottom: 2, height: 20, fontSize: 16, textAlign: 'center' }}
						>
							{article.title}
						</TextTicker>
					</View>
				</View>
			</TouchableHighlight>
		);
	}

	render() {
		const { activeDot } = this.state;

		return (
			<View>
				<View style={{ marginTop: 5, height: HEIGHT_NEWS }}>
					<Carousel
						data={this.getArticles()}
						renderItem={({ item }) => this.renderArticle(item)}
						sliderWidth={sliderWidth}
						itemWidth={sliderWidth * WIDTH_MULTIPLICATOR_NEWS}
						onSnapToItem={activeDot => this.setState({ activeDot })}
					/>
				</View>
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
