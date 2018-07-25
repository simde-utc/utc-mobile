import React from 'react'
import { View, Text, Image } from 'react-native'
import { createDrawerNavigator, DrawerItems, SafeAreaView } from 'react-navigation';

import styles from '../styles/'
import { colors } from '../styles/variables'

import MainLayout from './MainLayout'
// DEBUG
const show = (text) => (<View style={ styles.container.center }><Text style={ styles.text.h0 }>{ text }</Text></View>)
const ProfileScreen = () => show('Profile')
const SettingsScreen = () => show('Settings')

export default AppLayout = createDrawerNavigator({
	Main: {
		screen: MainLayout
	},
	Profile: {
		screen: ProfileScreen
	},
	Settings: {
		screen: SettingsScreen
	},
}, {

	initialRouteName: 'Main',
	contentOptions: {
		activeTintColor: colors.yellow
	}
})