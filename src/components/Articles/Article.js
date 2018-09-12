import React from 'react';
import { View, Text, Dimensions, TouchableHighlight, Image, Linking} from 'react-native';
import styles from '../../styles'
import { colors } from '../../styles/variables';
import HTML from 'react-native-render-html';
import Markdown from 'react-native-simple-markdown';
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

const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

export default class ArticleComponent extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = this.props.initialState || {
			folded: true,
			liked: false,
			disliked: false,
			seen: false,
			comments: 0,
		}
		this.image = null;
		this.imageResizeMode = "cover";
		this._getActionsAndComments();
		this._handleMedia();
		this.unmounted = false;
	}


	componentWillUnmount() {
		//très fréquent lorsque les articles sortent d'une flatlist
		this.unmounted = true;
	}



	_getActionsAndComments() {
		if(this.props.data["article_type"] == 'assos') {

		Promise.all(
		[this.props.portailInstance.getUserArticleActions(this.props.data["id"]),
		this.props.portailInstance.getArticleRootComments(this.props.data["id"])])
		.then( ( [[responseActions, statusActions], [responseComments, statusComments]] )=> {
				var liked, disliked;
				if(!responseActions["liked"]) {liked = false; disliked = false;}
				else {
					if(responseActions["liked"] == "true") {liked = true; disliked = false;}
					if(responseActions["liked"] == "false") {liked = false; disliked = true; }
				}

				this.comments = responseComments;
				if(!this.unmounted) {
					this.setState(prevState => ({ ...prevState, comments: responseComments.length, liked: liked, disliked: disliked}));
				}
			});


		}
	}

	_touchComments() {
		if(!this.props.fullScreen) {
			this._navigateFullArticle();
		}
		else {
			//TODO: scrolldown du scrollview et de la flatlist de niveau 1, et proposer édition d'un nouveau commentaire

		}
	}

	_touchLike() {
		var promise;
		if(this.state.liked == false && this.state.disliked == false) {
			promise = this.props.portailInstance.createArticleAction(this.props.data["id"], "liked", "true");
		}

		if(this.state.liked == false && this.state.disliked == true) {
			promise = this.props.portailInstance.updateArticleAction(this.props.data["id"], "liked", "true");
		}

		if(this.state.liked == true) {
			promise = this.props.portailInstance.deleteArticleAction(this.props.data["id"], "liked");
		}

		this._handleLikeDislikePromise(promise);
	}

	_touchDislike() {
		var promise;
		if(this.state.disliked == false && this.state.liked == false) {
			promise = this.props.portailInstance.createArticleAction(this.props.data["id"], "liked", "false");
		}

		if(this.state.disliked == false && this.state.liked == true) {
			promise = this.props.portailInstance.updateArticleAction(this.props.data["id"], "liked", "false");
		}

		if(this.state.disliked == true) {
			promise = this.props.portailInstance.deleteArticleAction(this.props.data["id"], "liked");
		}

		this._handleLikeDislikePromise(promise);
	}

	_handleLikeDislikePromise(promise) {
		return promise.then( ([response, status]) => {
			var liked, disliked;
			if(response === undefined || response["liked"] === undefined) {liked = false; disliked = false;}
			else {
				if(response["liked"] == "true") {liked = true; disliked = false;}
				if(response["liked"] == "false") {liked = false; disliked = true; }
			}
			if(!this.unmounted) {
				this.setState(prevState => ({ ...prevState, liked: liked, disliked: disliked}));
			}
			if(this.props.requestParentStateRefresh) {this.props.requestParentStateRefresh();}
		});
	}



	_prettyDate(string, locale) {
	let date = new Date(string);
		switch (locale) {
			case "fr-FR":
				return this._renderDate(date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear());
				break;
			case "en-US":
			default:
				return this._renderDate(date.getMonth() + "/" + date.getDay() + "/" + date.getFullYear());
				break;
		}
	}

	_renderDate(string) {
		return (<Text style={styles.article.dateText}>{string}</Text>);
	}

	_handleMedia() {
		if(this.props.data["wp:featuredmedia"]) {
			if(SUPPORTED_IMAGE_FORMATS.includes(this.props.data["wp:featuredmedia"]["mime_type"])) {
				this.image = this.props.data["wp:featuredmedia"]["source_url"];
				if (this.props.data["wp:featuredmedia"]["height"] > this.props.data["wp:featuredmedia"]["width"]) {
					//l'auteur de l'article est graphiquement mauvais, mais grâce à wordpress on peut le détecter
					this.imageResizeMode = "contain";
				}
			}
		}

		if(this.props.data["image"]) {
			this.image = this.props.data["image"]; //on prie pour que l'image soit compatible
		}
	}

	_toggleFolded() {
		if(!this.unmounted) {
			this.setState(prevState => ({ ...prevState, folded: !prevState.folded }));
		}
	}

	_openURI = (uri) => {
	    Linking.canOpenURL(uri).then(supported => {
	      if (supported) {
		Linking.openURL(uri);
	      } else {
		console.log("Don't know how to open URI: " + uri);
	      }
	    });
	};

	_contentTap(){
		if(!this.state.folded) {
			this._navigateFullArticle();
		}
		else {
			this._toggleFolded();
		}
	}

	_navigateFullArticle() {
		this.props.navigation.navigate('fullArticle', {
				article: <ArticleComponent {...this.props} fullScreen={true} initialState={this.state} requestParentStateRefresh={this._getActionsAndComments} comments={this.comments}/>,
			});
	}

	render() {
		return (
			<View style={styles.article.container}>
				{/***HEADER***/}
				<View style={styles.article.headersContainer}>
					{/***AUTEUR***/}
					<View style={styles.article.authorContainer}>
						<Image
						style={styles.article.authorImage}
						source={this.props.data["owned_by"] && this.props.data["owned_by"]["image"] ? {uri: this.props.data["owned_by"]["image"]} : LogoUTC}
						resizeMode={"contain"}
						resizeMethod={"resize"}
						/>
						<Text style={styles.article.authorText}>
							{this.props.data["owned_by"] ? this.props.data["owned_by"]["shortname"] : "UTC"}
						</Text>
					</View>
					{/***DATE***/}
					<View style={styles.article.dateContainer}>
						{this.props.data["created_at"] ?
							this._prettyDate(this.props.data["created_at"], "fr-FR") :
							this._prettyDate(this.props.data["date_gmt"], "fr-FR")
						}
					</View>
					{/***TODO: locale***/}
				</View>
				{/***TITRE***/}
				<View style={styles.article.titleContainer}>
					<HTML
						html={'<span style="' + styles.article.title + '">' + this.props.data["title"] + '</span>'}

					 />
					{/*** on est obligé de mettre un html pour le titre des actus. Même s'il n'y a pas de balise, il y a des entités html (par exemple &amp; -> "&") utilisées souvent pour les accents français.} ***/}
				</View>
				<TouchableHighlight onPress={() => this._contentTap() } underlayColor={this.state.folded ? '#ffffff00' : '#33333333'}><View>
					{/***IMAGE***/}
					{this.image &&
						<View style={styles.article.imageContainer}>
							<Image style={{height: 100, width: Dimensions.get('window').width}} resizeMode={this.imageResizeMode} resizeMethod={'scale'}  source={{uri: this.image}} />
						</View>
					}
					<View style={styles.article.contentContainer}>
						{/***DESCRIPTION***/}
						{(!this.state.folded && !this.props.fullScreen) &&
							<View style={{maxHeight:50}}>
								{this.props.data["description"] ?
									<Text style={{textAlign: 'left', margin:0, padding:0, color: styles.article.descriptionConstants.textColor}}>{this.props.data["description"]}</Text> :
									<HTML style={{textAlign: 'left', flex:1}} html={this.props.data["excerpt"]} imagesMaxWidth={Dimensions.get('window').width} />
								}
							</View>
						}
						{/***CONTENU***/}
						{this.props.fullScreen &&
							<View>
							 	{this.props.data["article_type"] == 'utc' ?
								<HTML
									html={this.props.data["content"]}
									onLinkPress={ (e, href) => {this._openURI(href);} }
									imagesMaxWidth={Dimensions.get('window').width}
						 		/> :
								<Markdown styles={styles.article.contentMarkdown}>
									{this.props.data["content"]}
								</Markdown>
								}
							</View>
						}
					</View>
				</View></TouchableHighlight>
				{/*** BOUTONS D'ACTION ***/}
				{(this.props.fullActions && this.props.data["article_type"] == 'assos') ?
				<View style={styles.article.fullActionsContainer}>
					<TouchableHighlight onPress={() => this._touchLike()} underlayColor={'#ffffff33'}>
						<Image source={this.state.liked ? LikeOn : LikeOff} style={styles.article.actionIcon} />
					</TouchableHighlight>

					<TouchableHighlight onPress={() => this._touchDislike()} underlayColor={'#ffffff33'}>
						<Image source={this.state.disliked ? DislikeOn : DislikeOff} style={styles.article.actionIcon} />
					</TouchableHighlight>

					<TouchableHighlight onPress={() => this._touchComments()} underlayColor={'#ffffff33'}>
						<CommentsIcon number={this.state.comments}/>
					</TouchableHighlight>
				</View> :
				<View style={styles.article.onlyCommentsActionsContainer}>
					<TouchableHighlight onPress={() => this._touchComments()} underlayColor={'#ffffff33'}>
						<CommentsIcon number={this.state.comments}/>
					</TouchableHighlight>
				</View>
				}
				{/***BOUTON DE DEVELOPPEMENT***/}
				{!this.props.fullScreen &&
					<TouchableHighlight onPress={() => this._toggleFolded() } style={styles.article.buttonContainer} underlayColor={'#33333333'}>
							<Image style={styles.article.buttonImage} resizeMode={'contain'} resizeMethod={'resize'} source={ this.state.folded ? DownBlueDevelopArrow : UpYellowDevelopArrow} />
					</TouchableHighlight>
				}
				{/***COMMENTAIRES***/}
				{(this.props.fullScreen && this.state.comments>0 && this.props.comments) &&
					<View style={{marginTop: 5}}>
						<Comments data={this.props.comments} />
					</View>
				}
			</View>
		);


	}
}
