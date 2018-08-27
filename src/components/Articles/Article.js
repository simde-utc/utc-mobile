import React from 'react';
import { View, Text, Dimensions, TouchableHighlight, Image, Linking} from 'react-native';
import styles from '../../styles'
import { colors } from '../../styles/variables';
import HTML from 'react-native-render-html';
import Markdown from 'react-native-simple-markdown';
import DownBlueDevelopArrow from '../../img/down_blue_develop_arrow.png';
import UpYellowDevelopArrow from '../../img/up_yellow_develop_arrow.png';
// Faire attention: https://github.com/vault-development/react-native-svg-uri#known-bugs

export default class ArticleComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			folded: true,
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
	
	render() {
		return (
			<View style={styles.article.container}>
				{/***TITRE***/}
				<View style={styles.article.titleContainer}>
					<HTML
						html={'<span style="' + styles.article.title + '">' + this.props.data["title"] + '</span>'}
				
					 />
					{/*** on est obligé de mettre un html pour le titre des actus. Même s'il n'y a pas de balise, il y a des entités html (par exemple &amp; -> "&") utilisées souvent pour les accents français.} ***/}
				</View>
				<View style={styles.article.contentContainer}>
					{/***DESCRIPTION***/}
					{this.state.folded &&
						<View style={{maxHeight:50}}>
							{this.props.data["description"] ?
								<Text style={{textAlign: 'center', margin:0, padding:0}}>{this.props.data["description"]}</Text> : 
								<HTML style={{textAlign: 'center', flex:1}} html={this.props.data["excerpt"]} imagesMaxWidth={Dimensions.get('window').width} />
							}
						</View>
					}
					{/***CONTENU COMPLET***/}
					{!this.state.folded &&
						<View>
						 {this.props.data["date_gmt"] ?
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
				{/***BOUTON DE DEVELOPPEMENT***/}
				<TouchableHighlight onPress={() => this._toggleFolded() } style={styles.article.buttonContainer} underlayColor={'#33333333'}>
						<Image style={{height: 15}} resizeMode={'contain'} resizeMethod={'resize'} source={ this.state.folded ? DownBlueDevelopArrow : UpYellowDevelopArrow} />
				</TouchableHighlight>
			</View>
		);


	}
}
