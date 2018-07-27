import React from 'react';
import { createBottomTabNavigator  } from 'react-navigation';
import { View, Text } from 'react-native';
import styles from '../styles/'

import HomeScreen from './Home/';
import StorageTestScreen from './StorageTest';

const show = (text) => <View style={ styles.container.center }><Text style={ styles.text.h0}>{ text }</Text></View>
// const HomeScreen = () => show('Home')
const EventsScreen = () => show('Events')
const AgendaScreen = () => show('Agenda')
const NotificationsScreen = () => show('Notifications')
const SettingsScreen = () => show('Settings')

export default MainLayout = createBottomTabNavigator ({
	Storage: StorageTestScreen,
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
	initialRouteName: 'Storage'
});