import React from 'react';
import { View, Text, Dimensions, TouchableHighlight, Image} from 'react-native';
import styles from '../../styles'
import { colors } from '../../styles/variables';
import HTML from 'react-native-render-html';
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
	
	render() {
		return (
			<View style={styles.article.container}>
				{/***TITRE***/}
				<View style={styles.article.titleContainer}>
					<HTML html={'<span style="' + styles.article.title + '">' + this.props.data["title"] + '</span>'} />
					{/*** on est obligé de mettre un html pour le titre des actus. Même s'il n'y a pas de balise, il y a des entités html (par exemple &amp; -> "&") utilisées souvent pour les accents français. ***/}
				</View>
				<View style={styles.article.contentContainer}>
					{/***DESCRIPTION***/}
					{this.state.folded &&
						<View style={{maxHeight:50, flex:1}}>
							{this.props.data["description"] ?
								<Text style={{textAlign: 'center'}}>{this.props.data["description"]}</Text> : 
								<HTML html={this.props.data["excerpt"]} imagesMaxWidth={Dimensions.get('window').width} />
							}
						</View>
					}
					{/***CONTENU COMPLET***/}
					{!this.state.folded &&
						<Text>{ this.props.data["content"]}</Text>
					}
				</View>
				{/***BOUTON DE DEVELOPPEMENT***/}
				<TouchableHighlight onPress={() => this._toggleFolded() } style={{flex:1, marginTop: 5, height:20, maxWidth: '30%', alignItems: 'center', justifyContent: 'center'}} underlayColor={'#33333333'}>
						<Image style={{height: 15}} resizeMode={'contain'} resizeMethod={'resize'} source={ this.state.folded ? DownBlueDevelopArrow : UpYellowDevelopArrow} />
				</TouchableHighlight>
			</View>
		);


	}
}
