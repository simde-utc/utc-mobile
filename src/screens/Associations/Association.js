import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';
import DetailScreen from './Details';
import ArticleScreen from './Articles';
// import EventsScreen from './Events';
import MemberScreen from './Members';

const TopTabNavigator = createMaterialTopTabNavigator(
	{
		AssociationDetails: {
			screen: DetailScreen,
			navigationOptions: {
				title: 'En bref',
			},
		},
		AssociationArticles: {
			screen: ArticleScreen,
			navigationOptions: {
				title: 'Articles',
			},
		},
		// AssociationEvents: {
		// 	screen: EventsScreen,
		// 	navigationOptions: {
		// 		title: 'Évents',
		// 	},
		// },
		AssociationMembers: {
			screen: MemberScreen,
			navigationOptions: {
				title: 'Trombi',
			},
		},
	},
	{
		tabBarOptions: {
			labelStyle: {
				fontSize: 12,
				fontWeight: 'bold',
				color: '#007383',
			},
			style: {
				backgroundColor: '#fff',
			},
		},
	}
);

export default class Association extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle:
			typeof navigation.state.params !== 'undefined' &&
			typeof navigation.state.params.title !== 'undefined'
				? navigation.state.params.title
				: 'Association',
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	});

	// This need to be added for sharing Navigation's properties with TopTabNavigator and its sub-components
	static router = TopTabNavigator.router;

	render() {
		const { navigation } = this.props;

		return <TopTabNavigator navigation={navigation} />;
	}
}
