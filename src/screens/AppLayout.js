import React from 'react'
import { ScrollView, View, Text, Image } from 'react-native'
import { createDrawerNavigator, DrawerItems, SafeAreaView } from 'react-navigation';

import styles from '../styles/'
import { colors } from '../styles/variables'

import MainLayout from './MainLayout'
// DEBUG
const show = (text) => (<View style={ styles.container.center }><Text style={ styles.text.h0 }>{ text }</Text></View>)
const ProfileScreen = () => show('Profile')
const LoginScreen = () => show('Login')
const SettingsScreen = () => show('Settings')

class CustomDrawerContentComponent extends React.Component {
	render() {
		let isConnected = false	// DEBUG

		const headerColor = isConnected ? 'bg.yellow' : 'bg.lightBlue'
		const textColor = isConnected ? 'text.gray' : 'text.white'
		const headerStyle = styles.get('container.center', 'p.sm', headerColor)
		const headerImagePath = isConnected ? require('../../icon.png') : require('../../icon.png')
		const headerImageStyle = isConnected ? styles.img.bigAvatar : styles.img.bigThumbnail
		const headerText = isConnected ? "My Super Name" : "Application UTC"
		const headerTextStyle = styles.get(textColor, 'text.h1')

		return (
			<ScrollView>
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
	contentOptions: {
		activeTintColor: colors.yellow
	}
})