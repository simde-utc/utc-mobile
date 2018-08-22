/**
 * Fichier chargé pour lancer l'application. Définie toutes les routes qui suivent
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Alexabdre Brasseur <alexandre.brasseur@etu.utc.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { View, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';

import { createSwitchNavigator, createStackNavigator, SafeAreaView } from 'react-navigation';
import AppLoader from './src/screens/AppLoader';
import AppLayout from './src/screens/AppLayout';
import ConnectionScreen from './src/screens/Connection/';
import ConnectedScreen from './src/screens/Connected/';
import WelcomeScreen from './src/screens/Welcome/';


const AuthStack = createStackNavigator({
	Welcome: WelcomeScreen,
	Connection: ConnectionScreen,
	Connected: ConnectedScreen
})

const AppSwitch = createSwitchNavigator({
	Loading: AppLoader,
	Auth: AuthStack,
	App: AppLayout
}, {
	initialRouteName: 'Loading'
})

export default class App extends React.Component {
	render() {
		return (
			<Provider store={ store }>
				<SafeAreaView style={{ flex: 1 }}>
					<StatusBar
						translucent={ true }
					/>
					<AppSwitch />
				</SafeAreaView>
			</Provider>
		);
	}
}
