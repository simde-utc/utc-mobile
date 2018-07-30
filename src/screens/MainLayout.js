import React from 'react';
import { Platform, View, Text, Image } from 'react-native';
import { createBottomTabNavigator  } from 'react-navigation';

// import HomeScreen from './Home/';
import styles from '../styles/'

import Icon from '../components/Icon'

import HomeOn from '../img/icons/navbar/home-on.svg'
import HomeOff from '../img/icons/navbar/home-off.svg'
import NewsOn from '../img/icons/navbar/news-on.svg'
import NewsOff from '../img/icons/navbar/news-off.svg'
import EventsOn from '../img/icons/navbar/events-on.svg'
import EventsOff from '../img/icons/navbar/events-off.svg'
import NotificationsOn from '../img/icons/navbar/bell-on.svg'
import NotificationsOff from '../img/icons/navbar/bell-off.svg'
import HamburgerOn from '../img/icons/navbar/hamburger-on.svg'
import HamburgerOff from '../img/icons/navbar/hamburger-off.svg'


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
const NewsScreen = () => show('News')
const EventsScreen = () => show('Events')
const NotificationsScreen = () => show('Notifications')
const HamburgerScreen = () => show('Hamburger')

const tabBarOptions = Platform.OS === 'ios' ?
  {
    // iOS tabBarOptions
    showLabel: false
  } : {
    // Android tabBarOptions
    showIcon: true,
    showLabel: false
  }


export default MainLayout = createBottomTabNavigator ({
	Home: {
		screen: HomeScreen,
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused }) => (
				<Icon image={ focused ? HomeOn : HomeOff } />
			)
		})
	},
	News: {
		screen: NewsScreen,
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused }) => (
				<Icon image={ focused ? NewsOn : NewsOff } />
			)
		})
	},
	Events: {
		screen: EventsScreen,
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused }) => (
				<Icon image={ focused ? EventsOn : EventsOff } />
			)
		})
	},
	Notifications: {
		screen: NotificationsScreen,
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused }) => (
				<Icon image={ focused ? NotificationsOn : NotificationsOff } />
			)
		})
	},
	Hamburger: {
		screen: HamburgerScreen,
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused }) => (
				<Icon image={ focused ? HamburgerOn : HamburgerOff } />
			),
			tabBarOnPress: ({ navigation }) => navigation.toggleDrawer()
		})
	},
}, {
	initialRouteName: 'Home',
	tabBarOptions: tabBarOptions,
});
