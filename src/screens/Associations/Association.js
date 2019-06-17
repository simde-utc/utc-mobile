import React from 'react';
import { createSwitchNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import DescriptionScreen from './Description';
import ArticleScreen from './Articles';
import ContactsScreen from './Contacts';
import MemberScreen from './Members';

const DetailsNavigator = createSwitchNavigator({
	AssociationDescription: DescriptionScreen,
	AssociationContacts: ContactsScreen,
});

const TopTabNavigator = createMaterialTopTabNavigator(
	{
		AssociationDetails: {
			screen: DetailsNavigator,
			navigationOptions: {
				title: 'Détails',
			},
		},
		AssociationArticles: {
			screen: ArticleScreen,
			navigationOptions: {
				title: 'Articles',
			},
		},
		AssociationMembers: {
			screen: MemberScreen,
			navigationOptions: {
				title: 'Membres',
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
		headerTitle: navigation.state.params.title || 'Association',
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
