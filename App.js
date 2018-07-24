import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';

import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import AppLoader from './src/screens/AppLoader';
import MainLayout from './src/screens/MainLayout';
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
	Main: MainLayout
}, {
	initialRouteName: 'Loading'
})

export default class App extends React.Component {
	render() {
		return (
			<Provider store={ store }>
				<AppSwitch />
			</Provider>
		);
	}
}
