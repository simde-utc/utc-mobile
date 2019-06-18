import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';

import DetailScreen from './Details';
import ArticleScreen from './Articles';
// import EventsScreen from './Events';
import MemberScreen from './Members';
import { _ } from '../../utils/i18n';

const TopTabNavigator = createMaterialTopTabNavigator(
	{
		AssociationDetails: {
			screen: DetailScreen,
			navigationOptions: () => ({
				title: _('details'),
			}),
		},
		AssociationArticles: {
			screen: ArticleScreen,
			navigationOptions: () => ({
				title: _('articles'),
			}),
		},
		// AssociationEvents: {
		// 	screen: EventsScreen,
		// 	navigationOptions: {
		// 		title: 'Évents',
		// 	},
		// },
		AssociationMembers: {
			screen: MemberScreen,
			navigationOptions: () => ({
				title: _('members'),
			}),
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
		headerTitle: navigation.getParam('title', _('association')),
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
