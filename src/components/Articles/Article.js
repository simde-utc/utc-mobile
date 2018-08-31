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
// Faire attention: https://github.com/vault-development/react-native-svg-uri#known-bugs

const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

export default class ArticleComponent extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
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
	}

	_getActionsAndComments() {
		if(this.props.data["article_type"] == 'assos') {
			this.props.portailInstance.getUserArticleActions(this.props.data["id"]).then( ([response, status]) => {
				if(response == []) {this.setState(prevState => ({ ...prevState, liked: false, disliked: false }));}
				else {
					if(response["liked"] == "true") {this.setState(prevState => ({ ...prevState, liked: true, disliked: false }));}
					if(response["liked"] == "false") {this.setState(prevState => ({ ...prevState, liked: false, disliked: true }));}
				}
			});
		}
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
		this.setState(prevState => ({ ...prevState, folded: !prevState.folded }));
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
			this.props.navigation.navigate('fullArticle', {
				data: this.props.data,
			});
		}
		else {
			this._toggleFolded();
		}
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
						{!this.state.folded &&
							<View style={{maxHeight:50}}>
								{this.props.data["description"] ?
									<Text style={{textAlign: 'left', margin:0, padding:0, color: styles.article.descriptionConstants.textColor}}>{this.props.data["description"]}</Text> : 
									<HTML style={{textAlign: 'left', flex:1}} html={this.props.data["excerpt"]} imagesMaxWidth={Dimensions.get('window').width} />
								}
							</View>
						}
					</View>
				</View></TouchableHighlight>
				{/*** BOUTONS D'ACTION ***/}
				<View style={styles.article.actionsContainer}>
					<Image source={this.state.liked ? LikeOn : LikeOff} style={styles.article.actionIcon} />
					<Image source={this.state.disliked ? DislikeOn : DislikeOff} style={styles.article.actionIcon} />
					<CommentsIcon number={this.state.comments}/>
				
				</View>
				{/***BOUTON DE DEVELOPPEMENT***/}
				<TouchableHighlight onPress={() => this._toggleFolded() } style={styles.article.buttonContainer} underlayColor={'#33333333'}>
						<Image style={styles.article.buttonImage} resizeMode={'contain'} resizeMethod={'resize'} source={ this.state.folded ? DownBlueDevelopArrow : UpYellowDevelopArrow} />
				</TouchableHighlight>
			</View>
		);


	}
}
