import React from 'react'
import { ScrollView, View, Text, Image, Dimensions } from 'react-native'
import { createDrawerNavigator, DrawerItems, SafeAreaView } from 'react-navigation'

import CASAuth from '../services/CASAuth'
import PortailApi from '../services/Portail'
import { colors } from '../styles/variables'
import styles from '../styles/'

import MainLayout from './MainLayout'
import AssosNavigator from './Assos'
import ProfileScreen from './Profile'

// DEBUG
const show = (text) => (<View style={ styles.container.center }><Text style={ styles.text.h0 }>{ text }</Text></View>)
const SettingsScreen = () => show('Settings')

class CustomDrawerContentComponent extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			login: ''
		}

		if (CASAuth.isConnected()) {
			CASAuth.getLogin().then((login) => {
				this.setState((prevState) => {
					prevState.login = login

					return prevState
				})
			})
		}
	}

	render() {
		const headerStyle = styles.get('container.center', 'px.sm', 'py.lg', 'mb.lg', 'bg.lightBlue')
		const headerImagePath = CASAuth.isConnected() ? { uri: 'https://demeter.utc.fr/portal/pls/portal30/portal30.get_photo_utilisateur?username=' + this.state.login } : require('../img/icon.png')
		const headerImageStyle = PortailApi.isConnected() ? styles.img.bigAvatar : styles.img.bigThumbnail
		const headerText = PortailApi.getUser().name
		const headerTextStyle = styles.get('text.h1', 'text.yellow', 'text.center')

		return (
			<ScrollView style={ styles.get('bg.lightBlue') }>
				<SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
					<View style={ headerStyle }>
						<Image style={ headerImageStyle } source={ headerImagePath } resizeMode="center" />
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
	Assos: {
		screen: AssosNavigator
	},
	Login: {
		screen: ProfileScreen
	},
	Settings: {
		screen: SettingsScreen
	},
}, {
	contentComponent: CustomDrawerContentComponent,
	initialRouteName: 'Main',
	drawerPosition: 'right',
	// drawerWidth: Dimensions.get('window').width,
	contentOptions: {
		activeTintColor: colors.yellow,
		inactiveTintColor: colors.white,
	}
})
