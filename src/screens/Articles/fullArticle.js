import React from 'react';
import { ScrollView } from 'react-native';

import { _, e } from '../../utils/i18n';

export default class fullArticleScreen extends React.PureComponent {
	static navigationOptions = {
		title: _('article'),
	};

	constructor(props) {
		super(props);

		this.article = props.navigation.getParam('article', 'NODATA');

		if (this.article === 'NOARTICLE') {
			throw e('no_articles');
		}
	}

	render() {
		return <ScrollView>{this.article}</ScrollView>;
	}
}
