import React from 'react';
import { View, Text, Dimensions, TouchableHighlight, Image, Linking, ScrollView} from 'react-native';
import styles from '../../styles';
import LogoUTC from '../../img/icon.png';
import HTML from 'react-native-render-html';
import Markdown from 'react-native-simple-markdown';

const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

export default class fullArticleScreen extends React.PureComponent {
	static navigationOptions = {
		title: 'Article',
	};

	constructor(props) {
		super(props);
		this.data = this.props.navigation.getParam("data", "NODATA");
		if(this.data == "NODATA") {throw "No data provided";}
		this._handleMedia();
	}

	_handleMedia() {
		if(this.props.data["wp:featuredmedia"]) {
			if(SUPPORTED_IMAGE_FORMATS.includes(this.props.data["wp:featuredmedia"]["mime_type"])) {
				this.image = this.props.data["wp:featuredmedia"]["source_url"];
			}
		}

		if(this.props.data["image"]) {
			this.image = this.props.data["image"]; //on prie pour que l'image soit compatible
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
		if(this.data["wp:featuredmedia"]) {
			if(SUPPORTED_IMAGE_FORMATS.includes(this.data["wp:featuredmedia"]["mime_type"])) {
				this.image = this.data["wp:featuredmedia"]["source_url"];
			}
		}

		if(this.data["image"]) {
			this.image = this.data["image"]; //on prie pour que l'image soit compatible
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

	
	render() {
		

		return (
			<ScrollView>
			<View style={styles.article.container}>
				{/***HEADER***/}
				<View style={styles.article.headersContainer}>
					{/***AUTEUR***/}
					<View style={styles.article.authorContainer}>
						<Image
						style={styles.article.authorImage}
						source={this.data["owned_by"] ? {uri: this.data["owned_by"]["image"]} : LogoUTC}
						resizeMode={"contain"}
						resizeMethod={"resize"}
						/>
						<Text style={styles.article.authorText}>
							{this.data["owned_by"] ? this.data["owned_by"]["shortname"] : "UTC"}
						</Text>
					</View>
					{/***DATE***/}
					<View style={styles.article.dateContainer}>
						{this.data["created_at"] ?
							this._prettyDate(this.data["created_at"], "fr-FR") :
							this._prettyDate(this.data["date_gmt"], "fr-FR")
						}
					</View>
					{/***TODO: locale***/}
				</View>
				{/***TITRE***/}
				<View style={styles.article.titleContainer}>
					<HTML
						html={'<span style="' + styles.article.title + '">' + this.data["title"] + '</span>'}
				
					 />
					{/*** on est obligé de mettre un html pour le titre des actus. Même s'il n'y a pas de balise, il y a des entités html (par exemple &amp; -> "&") utilisées souvent pour les accents français.} ***/}
				</View>
				<View style={styles.article.contentContainer}>
					{/***CONTENU COMPLET***/}
					<View>
					 {this.data["date_gmt"] ?
						<HTML
							html={this.data["content"]}
							onLinkPress={ (e, href) => {this._openURI(href);} }
							imagesMaxWidth={Dimensions.get('window').width}
				 		/> :
						<Markdown styles={styles.article.contentMarkdown}>
							{this.data["content"]}
						</Markdown>
					}
					</View>		
					
				</View>
				{/***IMAGE***/}
				{this.image &&
					<View style={styles.article.imageContainer}>
						<Image style={{height: 300, width: Dimensions.get('window').width}} resizeMode={'contain'} resizeMethod={'scale'}  source={{uri: this.image}} />
					</View>
				}
			</View>
			</ScrollView>
		);
	}
}
