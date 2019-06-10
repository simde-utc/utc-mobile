import React from 'react';
import { Platform, View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import styles from '../styles';

// Screens
// import HomeScreen from './Home/';
// import StorageTestScree from './StorageTest'; // DEBUG
import EventsNavigator from './Events';
import ArticlesScreen from './Articles';

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
import NavigationScreen from './Navigation';

// DEBUG
const show = text => (
	<View style={styles.container.center}>
		<Text style={styles.text.h0}>{text}</Text>
	</View>
);
const HomeScreen = () => show('Home');
const NotificationsScreen = () => show('Notifications');

const tabBarOptions =
	Platform.OS === 'ios'
		? {
				// iOS tabBarOptions
				showIcon: true,
				showLabel: false,
				style: styles.mainLayout.tabBar,
				indicatorStyle: styles.mainLayout.indicator,
				iconStyle: styles.mainLayout.icon,
		  }
		: {
				// Android tabBarOptions
				showIcon: true,
				showLabel: false,
				style: styles.mainLayout.tabBar,
				indicatorStyle: styles.mainLayout.indicator,
				iconStyle: styles.mainLayout.icon,
		  };

const FocusedIcon = (on, off, focused) => <Icon image={focused ? on : off} />;

export default createMaterialTopTabNavigator(
	{
		// Storage: StorageTestScreen,	// DEBUG
		Home: {
			screen: HomeScreen,
			navigationOptions: () => ({
				tabBarIcon: ({ focused }) => FocusedIcon(HomeOn, HomeOff, focused),
			}),
		},
		News: {
			screen: ArticlesScreen,
			navigationOptions: () => ({
				tabBarIcon: ({ focused }) => FocusedIcon(NewsOn, NewsOff, focused),
			}),
		},
		Events: {
			screen: EventsNavigator,
			navigationOptions: () => ({
				tabBarIcon: ({ focused }) => FocusedIcon(EventsOn, EventsOff, focused),
			}),
		},
		Notifications: {
			screen: NotificationsScreen,
			navigationOptions: () => ({
				tabBarIcon: ({ focused }) => FocusedIcon(NotificationsOn, NotificationsOff, focused),
			}),
		},
		Hamburger: {
			screen: NavigationScreen,
			navigationOptions: () => ({
				tabBarIcon: ({ focused }) => FocusedIcon(HamburgerOn, HamburgerOff, focused),
			}),
		},
	},
	{
		initialRouteName: 'Home',
		tabBarOptions,
		tabBarPosition: 'bottom',
		swipeEnabled: false,
	}
);
