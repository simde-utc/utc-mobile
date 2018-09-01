import React from 'react';
import {View , Text} from 'react-native';

export default class fullArticleScreen extends React.PureComponent {
	static navigationOptions = {
		title: 'Article',
	};

	constructor(props) {
		super(props);
		this.article = this.props.navigation.getParam("article", "NODATA");
		if(this.article == "NOARTICLE") {throw "No article provided";}
	}

	
	
	
	render() 
	{
		return (<View>{this.article}</View>);
	}
}
