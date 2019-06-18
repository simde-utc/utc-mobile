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
import { _ } from '../../utils/i18n';

const NavigationScreen = ({ navigation }) => (
	<ScrollView style={styles.navigation.scrollView}>
		<ProfileHeader onPress={() => navigation.navigate('Profile')} />
		<FullWidthButton name={_('my_account')} onPress={() => navigation.navigate('Profile')} />
		<FullWidthButton name={_('associations')} onPress={() => navigation.navigate('Associations')} />
		<FullWidthButton name={_('faq')} onPress={() => navigation.navigate('FAQ')} />
		<FullWidthButton name={_('interactions')} onPress={() => navigation.navigate('Interactions')} />
		<FullWidthButton name={_('map')} onPress={() => navigation.navigate('Map')} />
		<FullWidthButton name={_('contacts')} onPress={() => navigation.navigate('Contacts')} />
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
				headerTitle: _('map'),
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
