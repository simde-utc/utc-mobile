import React from 'react';
import { createBottomTabNavigator  } from 'react-navigation';

// import HomeScreen from './Home/';
import { View, Text } from 'react-native';
import styles from '../styles/'

const show = (text) => {
	return (
		<View style={ styles.container.center }>
			<Text style={ styles.text.h0 }>
				{ text }
			</Text>
		</View>
	)
}

const HomeScreen = () => show('Home')
const EventsScreen = () => show('Events')
const AgendaScreen = () => show('Agenda')
const NotificationsScreen = () => show('Notifications')
const SettingsScreen = () => show('Settings')

export default MainLayout = createBottomTabNavigator ({
	Home: {
		screen: HomeScreen,
	},
	Events: {
		screen: EventsScreen,
	},
	Agenda: {
		screen: AgendaScreen,
	},
	Notifications: {
		screen: NotificationsScreen,
	},
	Settings: {
		screen: SettingsScreen,
	},
}, {
	initialRouteName: 'Home'
});
