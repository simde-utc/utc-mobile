import React from 'react';
import { ScrollView } from 'react-native';

export default class fullArticleScreen extends React.PureComponent {
	static navigationOptions = {
		title: 'Article',
	};

	constructor(props) {
		super(props);

		this.article = props.navigation.getParam('article', 'NODATA');

		if (this.article === 'NOARTICLE') {
			throw 'No article provided';
		}
	}

	render() {
		return <ScrollView>{this.article}</ScrollView>;
	}
}
