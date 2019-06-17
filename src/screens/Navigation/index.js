import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { ScrollView } from 'react-native';
import ProfileScreen from '../Profile';
import FullWidthButton from '../../components/FullWidthButton';
import ProfileHeader from '../Profile/ProfileHeader';
import AssociationsListScreen from '../Associations';
import AssociationScreen from '../Associations/Association';
import MapNavigator from '../Map';
import InteractionsScreen from '../Interactions';
import ContactsScreen from '../Contacts';
import CategoriesScreen from '../FAQs/Categories';
import QuestionsScreen from '../FAQs/Questions';
import styles from '../../styles';

const NavigationScreen = ({ navigation }) => (
	<ScrollView style={styles.navigation.scrollView}>
		<ProfileHeader onPress={() => navigation.navigate('Profile')} />
		<FullWidthButton name="Mon compte" onPress={() => navigation.navigate('Profile')} />
		<FullWidthButton name="Associations" onPress={() => navigation.navigate('Associations')} />
		<FullWidthButton name="Foire aux questions" onPress={() => navigation.navigate('FAQ')} />
		<FullWidthButton name="Interactions" onPress={() => navigation.navigate('Interactions')} />
		<FullWidthButton name="Plan" onPress={() => navigation.navigate('Map')} />
		<FullWidthButton name="Contacts" onPress={() => navigation.navigate('Contacts')} />
	</ScrollView>
);

const NavigationNavigator = createStackNavigator(
	{
		Navigation: {
			screen: NavigationScreen,
			navigationOptions: {
				header: null,
				headerForceInset: { top: 'never' },
			},
		},
		Associations: {
			screen: AssociationsListScreen,
		},
		Association: {
			screen: AssociationScreen,
		},
		FAQ: {
			screen: CategoriesScreen,
		},
		Questions: {
			screen: QuestionsScreen,
		},
		Map: {
			screen: MapNavigator,
			navigationOptions: {
				headerTitle: 'Plan',
				headerStyle: {
					backgroundColor: '#fff',
				},
				headerTintColor: '#007383',
				headerForceInset: { top: 'never' },
			},
		},
		Interactions: {
			screen: InteractionsScreen,
		},
		Contacts: {
			screen: ContactsScreen,
		},
		Profile: {
			screen: ProfileScreen,
		},
	},
	{
		initialRouteName: 'Navigation',
	}
);

export default NavigationNavigator;
