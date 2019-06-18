import React from 'react';
import { ScrollView } from 'react-native';
import ArticleComponent from '../../components/Articles/Article';
import styles from '../../styles';
import PortailApi from '../../services/Portail';

export default class fullArticleScreen extends React.PureComponent {
	static navigationOptions = ({ navigation }) => ({
		headerTitle:
			typeof navigation.state.params !== 'undefined' &&
			typeof navigation.state.params.title !== 'undefined'
				? navigation.state.params.title
				: 'Article',
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

		if (this.article === 'NOARTICLE') throw 'No article provided';

		if (this.navigation === 'NONAVIGATION') throw 'No navigation provided';
	}

	render() {
		return (
			<ScrollView style={styles.scrollable.list}>
				<ArticleComponent data={this.article} navigation={this.navigation} full={true} portailInstance={PortailApi} />
			</ScrollView>
		);
	}
}
