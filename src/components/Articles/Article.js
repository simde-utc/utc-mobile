import React from 'react';
import { View, Text, Dimensions, TouchableHighlight, Image, Linking } from 'react-native';
import HTML from 'react-native-render-html';
import Markdown from 'react-native-simple-markdown';
import styles from '../../styles';
import DownBlueDevelopArrow from '../../img/down_blue_develop_arrow.png';
import UpYellowDevelopArrow from '../../img/up_yellow_develop_arrow.png';
import LogoUTC from '../../img/icon.png';
import LikeOn from '../../img/icons/like.png';
import LikeOff from '../../img/icons/like-off.png';
import DislikeOn from '../../img/icons/dislike.png';
import DislikeOff from '../../img/icons/dislike-off.png';
import CommentsIcon from './CommentsIcon';
import Comments from './Comments';
// Faire attention: https://github.com/vault-development/react-native-svg-uri#known-bugs

const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

export default class ArticleComponent extends React.PureComponent {
	static openURI(uri) {
		Linking.canOpenURL(uri).then(supported => {
			if (supported) {
				Linking.openURL(uri);
			} else {
				console.log(`Don't know how to open URI: ${uri}`);
			}
		});
	}

	constructor(props) {
		super(props);

		this.state = props.initialState || {
			folded: true,
			liked: false,
			disliked: false,
			seen: false,
			comments: 0,
		};
		this.image = null;
		this.imageResizeMode = 'cover';

		this.getActionsAndComments();
		this.handleMedia();

		this.unmounted = false;
	}

	componentWillUnmount() {
		// très fréquent lorsque les articles sortent d'une flatlist
		this.unmounted = true;
	}

	getActionsAndComments() {
		const { data, portailInstance } = this.props;

		if (data.article_type === 'assos') {
			Promise.all([
				portailInstance.getUserArticleActions(data.id),
				portailInstance.getArticleRootComments(data.id),
			])
				.then(([[responseActions], [responseComments]]) => {
					let liked;
					let disliked;
					if (!responseActions.liked) {
						liked = false;
						disliked = false;
					} else {
						if (responseActions.liked === 'true') {
							liked = true;
							disliked = false;
						}
						if (responseActions.liked === 'false') {
							liked = false;
							disliked = true;
						}
					}

					this.comments = responseComments;
					if (!this.unmounted) {
						this.setState(prevState => ({
							...prevState,
							comments: responseComments.length,
							liked,
							disliked,
						}));
					}
				})
				.catch(([error, code]) =>
					console.warn(`Error ${code} while loading actions and comments : ${error}`)
				);
		}
	}

	touchLike() {
		const { portailInstance, data } = this.props;
		const { liked, disliked } = this.state;
		let promise;

		if (!liked && !disliked) {
			promise = portailInstance.createArticleAction(data.id, 'liked', 'true');
		}

		if (!liked && disliked) {
			promise = portailInstance.updateArticleAction(data.id, 'liked', 'true');
		}

		if (liked) {
			promise = portailInstance.deleteArticleAction(data.id, 'liked');
		}

		this.handleLikeDislikePromise(promise);
	}

	touchDislike() {
		const { portailInstance, data } = this.props;
		const { liked, disliked } = this.state;
		let promise;

		if (!disliked && !liked) {
			promise = portailInstance.createArticleAction(data.id, 'liked', 'false');
		}

		if (!disliked && liked) {
			promise = portailInstance.updateArticleAction(data.id, 'liked', 'false');
		}

		if (disliked) {
			promise = portailInstance.deleteArticleAction(data.id, 'liked');
		}

		this.handleLikeDislikePromise(promise);
	}

	handleLikeDislikePromise(promise) {
		const { requestParentStateRefresh } = this.props;

		return promise.then(([response]) => {
			let liked;
			let disliked;
			if (response === undefined || response.liked === undefined) {
				liked = false;
				disliked = false;
			} else {
				if (response.liked === 'true') {
					liked = true;
					disliked = false;
				}
				if (response.liked === 'false') {
					liked = false;
					disliked = true;
				}
			}
			if (!this.unmounted) {
				this.setState(prevState => ({ ...prevState, liked, disliked }));
			}
			if (requestParentStateRefresh) {
				requestParentStateRefresh();
			}
		});
	}

	prettyDate(string, locale) {
		const date = new Date(string);
		switch (locale) {
			case 'fr-FR':
				return ArticleComponent.renderDate(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);
			case 'en-US':
			default:
				return ArticleComponent.renderDate(`${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`);
		}
	}

	static renderDate(string) {
		return <Text style={styles.article.dateText}>{string}</Text>;
	}

	handleMedia() {
		const { data } = this.props;

		if (data['wp:featuredmedia']) {
			if (SUPPORTED_IMAGE_FORMATS.includes(data['wp:featuredmedia'].mime_type)) {
				this.image = data['wp:featuredmedia'].source_url;
				if (data['wp:featuredmedia'].height > data['wp:featuredmedia'].width) {
					// l'auteur de l'article est graphiquement mauvais, mais grâce à wordpress on peut le détecter
					this.imageResizeMode = 'contain';
				}
			}
		}

		if (data.image) {
			this.image = data.image; // on prie pour que l'image soit compatible
		}
	}

	toggleFolded() {
		if (!this.unmounted) {
			this.setState(prevState => ({ ...prevState, folded: !prevState.folded }));
		}
	}

	touchComments() {
		const { fullScreen } = this.props;

		if (!fullScreen) {
			this.navigateFullArticle();
		} else {
			// TODO: scrolldown du scrollview et de la flatlist de niveau 1, et proposer édition d'un nouveau commentaire
		}
	}

	_contentTap() {
		const { folded } = this.state;

		if (!folded) {
			this.navigateFullArticle();
		} else {
			this.toggleFolded();
		}
	}

	_navigateFullArticle() {
		const { navigation } = this.props;

		navigation.navigate('fullArticle', {
			article: (
				<ArticleComponent
					{...this.props}
					fullScreen
					initialState={this.state}
					requestParentStateRefresh={this.getActionsAndComments}
					comments={this.comments}
				/>
			),
		});
	}

	render() {
		const { data, fullScreen } = this.props;
		const { folded, comments, liked, disliked, fullActions } = this.state;

		return (
			<View style={styles.article.container}>
				{/** *HEADER** */}
				<View style={styles.article.headersContainer}>
					{/** *AUTEUR** */}
					<View style={styles.article.authorContainer}>
						<Image
							style={styles.article.authorImage}
							source={data.owned_by && data.owned_by.image ? { uri: data.owned_by.image } : LogoUTC}
							resizeMode="contain"
							resizeMethod="resize"
						/>
						<Text style={styles.article.authorText}>
							{data.owned_by ? data.owned_by.shortname : 'UTC'}
						</Text>
					</View>
					{/** *DATE** */}
					<View style={styles.article.dateContainer}>
						{data.created_at
							? this.prettyDate(data.created_at, 'fr-FR')
							: this.prettyDate(data.date_gmt, 'fr-FR')}
					</View>
					{/** *TODO: locale** */}
				</View>
				{/** *TITRE** */}
				<View style={styles.article.titleContainer}>
					<HTML html={`<span style="${styles.article.title}">${data.title}</span>`} />
					{/** * on est obligé de mettre un html pour le titre des actus. Même s'il n'y a pas de balise, il y a des entités html (par exemple &amp; -> "&") utilisées souvent pour les accents français.} ** */}
				</View>
				<TouchableHighlight
					onPress={() => this.contentTap()}
					underlayColor={folded ? '#ffffff00' : '#33333333'}
				>
					<View>
						{/** *IMAGE** */}
						{this.image && (
							<View style={styles.article.imageContainer}>
								<Image
									style={{ height: 100, width: Dimensions.get('window').width }}
									resizeMode={this.imageResizeMode}
									resizeMethod="scale"
									source={{ uri: this.image }}
								/>
							</View>
						)}
						<View style={styles.article.contentContainer}>
							{/** *DESCRIPTION** */}
							{!folded && !fullScreen && (
								<View style={{ maxHeight: 50 }}>
									{data.description ? (
										<Text
											style={{
												textAlign: 'left',
												margin: 0,
												padding: 0,
												color: styles.article.descriptionConstants.textColor,
											}}
										>
											{data.description}
										</Text>
									) : (
										<HTML
											style={{ textAlign: 'left', flex: 1 }}
											html={data.excerpt}
											imagesMaxWidth={Dimensions.get('window').width}
										/>
									)}
								</View>
							)}
							{/** *CONTENU** */}
							{fullScreen && (
								<View>
									{data.article_type === 'utc' ? (
										<HTML
											html={data.content}
											onLinkPress={(e, href) => {
												ArticleComponent.openURI(href);
											}}
											imagesMaxWidth={Dimensions.get('window').width}
										/>
									) : (
										<Markdown styles={styles.article.contentMarkdown}>{data.content}</Markdown>
									)}
								</View>
							)}
						</View>
					</View>
				</TouchableHighlight>
				{/** * BOUTONS D'ACTION ** */}
				{fullActions && data.article_type === 'assos' ? (
					<View style={styles.article.fullActionsContainer}>
						<TouchableHighlight onPress={() => this.touchLike()} underlayColor="#ffffff33">
							<Image source={liked ? LikeOn : LikeOff} style={styles.article.actionIcon} />
						</TouchableHighlight>

						<TouchableHighlight onPress={() => this.touchDislike()} underlayColor="#ffffff33">
							<Image source={disliked ? DislikeOn : DislikeOff} style={styles.article.actionIcon} />
						</TouchableHighlight>

						<TouchableHighlight onPress={() => this.touchComments()} underlayColor="#ffffff33">
							<CommentsIcon number={comments} />
						</TouchableHighlight>
					</View>
				) : (
					<View style={styles.article.onlyCommentsActionsContainer}>
						<TouchableHighlight onPress={() => this.touchComments()} underlayColor="#ffffff33">
							<CommentsIcon number={comments} />
						</TouchableHighlight>
					</View>
				)}
				{/** *BOUTON DE DEVELOPPEMENT** */}
				{!fullScreen && (
					<TouchableHighlight
						onPress={() => this.toggleFolded()}
						style={styles.article.buttonContainer}
						underlayColor="#33333333"
					>
						<Image
							style={styles.article.buttonImage}
							resizeMode="contain"
							resizeMethod="resize"
							source={folded ? DownBlueDevelopArrow : UpYellowDevelopArrow}
						/>
					</TouchableHighlight>
				)}
				{/** *COMMENTAIRES** */}
				{fullScreen && comments > 0 && comments && (
					<View style={{ marginTop: 5 }}>
						<Comments data={comments} />
					</View>
				)}
			</View>
		);
	}
}
