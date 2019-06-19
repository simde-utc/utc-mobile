/*
 * Bloc affichant les informations d'un article.
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license AGPL-3.0
 */

import React from 'react';
import { Dimensions, Image, Linking, Text, TouchableHighlight, View } from 'react-native';
import HTML from 'react-native-render-html';
import Markdown from 'react-native-simple-markdown';

import LogoUTC from '../../img/icon.png';
import LikeOn from '../../img/icons/like.png';
import LikeOff from '../../img/icons/like-off.png';
import DislikeOn from '../../img/icons/dislike.png';
import DislikeOff from '../../img/icons/dislike-off.png';
import styles from '../../styles';
import { Articles as t } from '../../utils/i18n';
// Faire attention: https://github.com/vault-development/react-native-svg-uri#known-bugs

const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const FOLDED_MAX_LENGTH = 200;

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

	static prettyDate(string, locale) {
		const date = new Date(string);
		switch (locale) {
			case 'fr-FR':
				return ArticleComponent.renderDate(
					`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
				);
			case 'en-US':
			default:
				return ArticleComponent.renderDate(
					`${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`
				);
		}
	}

	static renderDate(string) {
		return <Text style={styles.article.dateText}>{string}</Text>;
	}

	constructor(props) {
		super(props);

		this.state = props.initialState || {
			liked: false,
			disliked: false,
			seen: false,
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

		if (data.item.article_type === 'assos') {
			Promise.all([
				portailInstance.getUserArticleActions(data.item.id),
				portailInstance.getArticleRootComments(data.item.id),
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
				.catch(([{ message }, code]) =>
					console.warn(`Error ${code} while loading actions and comments : ${message}`)
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

	contentTap() {
		const { folded } = this.state;

		if (!folded) {
			this.navigateFullArticle();
		} else {
			this.toggleFolded();
		}
	}

	navigateFullArticle() {
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

	static renderOwnerImage(owned_by) {
		const source = owned_by && owned_by.image ? { uri: owned_by.image } : LogoUTC;

		return <Image style={styles.article.icon} source={source} resizeMode="contain" />;
	}

	renderTextDescription(description) {
		const { full } = this.props;

		if (!full && description.length > FOLDED_MAX_LENGTH)
			return (
				<View style={{ marginBottom: 5 }}>
					<Markdown styles={styles.article.markdownStyles}>
						{`${description.substring(0, 200)}...`}
					</Markdown>
					<View style={{ marginTop: 10 }}>
						<Text style={styles.article.descriptionLink}>{t('show_more')}</Text>
					</View>
				</View>
			);

		return (
			<View style={{ marginBottom: 5 }}>
				<Markdown styles={styles.article.markdownStyles}>{description}</Markdown>
			</View>
		);
	}

	renderHTMLDescription(excerpt, content) {
		const { full } = this.props;

		if (!full)
			return (
				<View>
					<HTML
						baseFontStyle={styles.scrollable.item.subsubtitle}
						html={excerpt.replace(t('to_remove'), '')} // L'API impose son lien vers la suite
						imagesMaxWidth={Dimensions.get('window').width}
						onLinkPress={(e, href) => ArticleComponent.openURI(href)}
					/>

					<Text style={styles.article.descriptionLink}>{t('show_more')}</Text>
				</View>
			);

		return (
			<HTML
				baseFontStyle={styles.scrollable.item.subsubtitle}
				html={content}
				imagesMaxWidth={Dimensions.get('window').width}
			/>
		);
	}

	render() {
		const { data, navigation } = this.props;
		const { liked, disliked } = this.state;

		return (
			<View style={styles.scrollable.item.view}>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					{ArticleComponent.renderOwnerImage(data.item.owned_by)}

					<View style={{ flex: 6 }}>
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
							<Text style={styles.scrollable.item.subtitle}>
								{data.item.owned_by ? data.item.owned_by.shortname : 'UTC'}
							</Text>

							<Text style={styles.article.date}>
								{data.item.created_at
									? ArticleComponent.prettyDate(data.item.created_at, 'fr-FR')
									: ArticleComponent.prettyDate(data.item.date_gmt, 'fr-FR')}
							</Text>
						</View>

						<TouchableHighlight
							onPress={() =>
								navigation.navigate('fullArticle', {
									article: data,
									navigation,
									title: data.item.title,
								})
							}
							underlayColor="#fff"
						>
							<View>
								<View style={{ marginBottom: 5 }}>
									<HTML baseFontStyle={styles.scrollable.item.title} html={data.item.title} />
								</View>

								{data.item.description
									? this.renderTextDescription(data.item.description)
									: this.renderHTMLDescription(data.item.excerpt, data.item.content)}
							</View>
						</TouchableHighlight>

						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
							<TouchableHighlight onPress={() => this.touchLike()} underlayColor="#ffffff33">
								<Image source={liked ? LikeOn : LikeOff} style={{ width: 30, height: 30 }} />
							</TouchableHighlight>

							<TouchableHighlight
								style={{ marginLeft: 5 }}
								onPress={() => this.touchDislike()}
								underlayColor="#ffffff33"
							>
								<Image
									source={disliked ? DislikeOn : DislikeOff}
									style={{ width: 30, height: 30 }}
								/>
							</TouchableHighlight>
						</View>
					</View>
				</View>
			</View>
		);
	}
}
