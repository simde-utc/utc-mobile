import React from 'react';
import { Platform, View, Text, Image } from 'react-native';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import styles from "../styles"

// Screens
// import HomeScreen from './Home/';
// import StorageTestScree from './StorageTest'; // DEBUG
import EventsNavigator from './Events';
import ArticlesScreen from './Articles';
import NavigationScreen from './Navigation';

// Icons
import Icon from '../components/Icon';
import HomeOn from '../img/icons/navbar/home-on.png';
import HomeOff from '../img/icons/navbar/home-off.png';
import NewsOn from '../img/icons/navbar/news-on.png';
import NewsOff from '../img/icons/navbar/news-off.png';
import EventsOn from '../img/icons/navbar/events-on.png';
import EventsOff from '../img/icons/navbar/events-off.png';
import NotificationsOn from '../img/icons/navbar/bell-on.png';
import NotificationsOff from '../img/icons/navbar/bell-off.png';
import HamburgerOn from '../img/icons/navbar/hamburger-on.png';
import HamburgerOff from '../img/icons/navbar/hamburger-off.png';

// DEBUG
const show = text => (
	<View style={styles.container.center}>
		<Text style={styles.text.h0}>{text}</Text>
	</View>
);
const HomeScreen = () => show('Home');
const NotificationsScreen = () => show('Notifications');

const ICON_SIZE = Platform.OS === 'android' ? 25 : 20;

const MainLayout = createBottomTabNavigator(
	{
		// Storage: StorageTestScreen,	// DEBUG
		Home: {
			screen: HomeScreen,
			navigationOptions: {
				title: 'Accueil',
				tabBarIcon: ({ focused }) => (
					<Icon image={focused ? HomeOn : HomeOff} height={ICON_SIZE} width={ICON_SIZE} />
				),
			},
		},
		News: {
			screen: ArticlesScreen,
			navigationOptions: {
				title: 'Actus',
				tabBarIcon: ({ focused }) => (
					<Icon image={focused ? NewsOn : NewsOff} height={ICON_SIZE} width={ICON_SIZE} />
				),
			},
		},
		Events: {
			screen: EventsNavigator,
			navigationOptions: {
				title: 'Calendrier',
				tabBarIcon: ({ focused }) => (
					<Icon image={focused ? EventsOn : EventsOff} height={ICON_SIZE} width={ICON_SIZE} />
				),
			},
		},
		Notifications: {
			screen: NotificationsScreen,
			navigationOptions: {
				title: 'Notifications',
				tabBarIcon: ({ focused }) => (
					<Icon
						image={focused ? NotificationsOn : NotificationsOff}
						height={ICON_SIZE}
						width={ICON_SIZE}
					/>
				),
			},
		},
		Hamburger: {
			screen: NavigationScreen,
			navigationOptions: {
				title: 'Navigation',
				tabBarIcon: ({ focused }) => (
					<Icon image={focused ? HamburgerOn : HamburgerOff} height={ICON_SIZE} width={ICON_SIZE} />
				),
			},
		},
	},
	{
		initialRouteName: 'Home',
		tabBarOptions: {
			showLabel: Platform.OS !== 'android', // On Android, we don't display icons label
			activeTintColor: '#007383',
			style: {
				borderTopColor: '#f1f1f1',
			},
		},
	}
);

export default MainLayout;
