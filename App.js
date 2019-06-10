/**
 * Fichier chargé pour lancer l'application. Définie toutes les routes qui suivent
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Alexandre Brasseur <alexandre.brasseur@etu.utc.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
 * */

import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { createSwitchNavigator, createStackNavigator, SafeAreaView } from 'react-navigation';
import store from './src/redux/store';
import {
	PORTAIL_URL,
	PORTAIL_CLIENT_ID,
	PORTAIL_CLIENT_SECRET,
	ACTUS_UTC_FEED_LOGIN,
	CAS_URL,
} from './config';

import AppLoader from './src/screens/AppLoader';
import ConnectionScreen from './src/screens/Connection';
import ConnectedScreen from './src/screens/Connected';
import WelcomeScreen from './src/screens/Welcome';
import MainLayout from './src/screens/MainLayout';

const AuthStack = createStackNavigator({
	Welcome: WelcomeScreen,
	Connection: ConnectionScreen,
	Connected: ConnectedScreen,
});

const AppSwitch = createSwitchNavigator(
	{
		Loading: AppLoader,
		Auth: AuthStack,
		App: MainLayout,
	},
	{
		initialRouteName: 'Loading',
	}
);

const paddingTop =
	Platform.OS === 'android' ? StatusBar.currentHeight || (Platform.Version < 23 ? 25 : 24) : 0;

export default class App extends React.Component {
	static checkEnvVariables() {
		if (
			!(
				PORTAIL_URL &&
				PORTAIL_CLIENT_ID &&
				PORTAIL_CLIENT_SECRET &&
				ACTUS_UTC_FEED_LOGIN &&
				CAS_URL
			)
		) {
			throw "L'application n'a pas été configurée correctement. Veuillez renseigner le fichier de configuration";
		}
	}

	constructor(props) {
		super(props);

		App.checkEnvVariables(); // on doit le mettre ici et pas dans les classes parce que certaines classes utilisent les variable d'environnement à l'appel d'un super donc pas de vérification possible
	}

	render() {
		return (
			<Provider store={store}>
				<SafeAreaView style={{ flex: 1, paddingTop }}>
					<StatusBar translucent />
					<AppSwitch />
				</SafeAreaView>
			</Provider>
		);
	}
}
