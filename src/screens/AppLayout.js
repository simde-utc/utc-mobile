import React from 'react'
import { ScrollView, View, Text, Image, Dimensions } from 'react-native'
import { createDrawerNavigator, DrawerItems, SafeAreaView } from 'react-navigation'

import PortailApi from '../services/Portail'
import { colors } from '../styles/variables'
import styles from '../styles/'

import MainLayout from './MainLayout'
// DEBUG
const show = (text) => (<View style={ styles.container.center }><Text style={ styles.text.h0 }>{ text }</Text></View>)
const ProfileScreen = () => show('Profile')
const LoginScreen = () => show('Login')
const SettingsScreen = () => show('Settings')

class CustomDrawerContentComponent extends React.Component {
	render() {
		const isConnected = PortailApi.isConnected()

		const headerStyle = styles.get('container.center', 'px.sm', 'py.lg', 'mb.lg', 'bg.lightBlue')
		const headerImagePath = isConnected ? require('../img/icon.png') : require('../img/icon.png')
		const headerImageStyle = isConnected ? styles.img.bigAvatar : styles.img.bigThumbnail
		const headerText = isConnected ? "My Super Name" : "Application UTC"
		const headerTextStyle = styles.get('text.h1', 'text.yellow')

		return (
			<ScrollView style={ styles.get('bg.lightBlue') }>
				<SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
					<View style={ headerStyle }>
						<Image style={ headerImageStyle } source={ headerImagePath } />
						<Text style={ headerTextStyle }>{ headerText }</Text>
					</View>
					<DrawerItems {...this.props} />
				</SafeAreaView>
			</ScrollView>
		);
	}
}


export default AppLayout = createDrawerNavigator({
	Main: {
		screen: MainLayout
	},
	Profile: {
		screen: ProfileScreen
	},
	Login: {
		screen: LoginScreen
	},
	Settings: {
		screen: SettingsScreen
	},
}, {
	contentComponent: CustomDrawerContentComponent,
	initialRouteName: 'Main',
	// drawerWidth: Dimensions.get('window').width,
	contentOptions: {
		activeTintColor: colors.yellow,
		inactiveTintColor: colors.white,
	}
})