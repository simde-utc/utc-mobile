import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

import EventsNavigator from './Events';
import ArticlesScreen from './Articles';
import HomeScreen from './Home';
import NavigationScreen from './Navigation';
import NotificationsScreen from './Notifications';
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
import { _ } from '../utils/i18n';

const ICON_SIZE = Platform.OS === 'android' ? 25 : 20;

const generateTabBar = (On, Off) => {
	const focusedIcon = ({ focused }) => (
		<Icon image={focused ? On : Off} height={ICON_SIZE} width={ICON_SIZE} />
	);

	return focusedIcon;
};

const MainLayout = createBottomTabNavigator(
	{
		Home: {
			screen: HomeScreen,
			navigationOptions: () => ({
				title: _('home'),
				tabBarIcon: generateTabBar(HomeOn, HomeOff),
			}),
		},
		News: {
			screen: ArticlesScreen,
			navigationOptions: () => ({
				title: _('actus'),
				tabBarIcon: generateTabBar(NewsOn, NewsOff),
			}),
		},
		Events: {
			screen: EventsNavigator,
			navigationOptions: () => ({
				title: _('calendar'),
				tabBarIcon: generateTabBar(EventsOn, EventsOff),
			}),
		},
		Notifications: {
			screen: NotificationsScreen,
			navigationOptions: () => ({
				title: _('notifications'),
				tabBarIcon: generateTabBar(NotificationsOn, NotificationsOff),
			}),
		},
		Hamburger: {
			screen: NavigationScreen,
			navigationOptions: () => ({
				title: _('menu'),
				tabBarIcon: generateTabBar(HamburgerOn, HamburgerOff),
			}),
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
