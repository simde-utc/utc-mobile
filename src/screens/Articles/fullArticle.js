import React from 'react';
import { ScrollView } from 'react-native';
import ArticleComponent from '../../components/Articles/Article';
import styles from '../../styles';
import PortailApi from '../../services/Portail';

import { _, e } from '../../utils/i18n';

export default class fullArticleScreen extends React.PureComponent {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: navigation.getParam('title', _('article')),
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	});

	constructor(props) {
		super(props);

		this.article = props.navigation.getParam('article', 'NOARTICLE');
		this.navigation = props.navigation.getParam('navigation', 'NONAVIGATION');

		if (this.article === 'NOARTICLE') {
			throw e('no_articles');
		}

		if (this.navigation === 'NONAVIGATION') {
			throw e('no_navigation');
		}
	}

	render() {
		return (
			<ScrollView style={styles.scrollable.list}>
				<ArticleComponent data={this.article} navigation={this.navigation} full />
			</ScrollView>
		);
	}
}
