import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { createStackNavigator } from 'react-navigation';

import WelcomeScreen from './src/screens/Welcome/';
import ConnectionScreen from './src/screens/Connection/';
import ConnectedScreen from './src/screens/Connected/';
import HomeScreen from './src/screens/Home/';

const RootStack = createStackNavigator(
	{
		Welcome: WelcomeScreen,
		Connection: ConnectionScreen,
		Connected: ConnectedScreen,

		Home: HomeScreen,
	},
	{
		initialRouteName: 'Welcome',
	}
);

export default class App extends React.Component {
	render() {
		return (
			<Provider store={ store }>
				<RootStack />
			</Provider>
		);
	}
}
{/***
export default class App extends React.Component {
	render() {
		return (
			<Provider store={ store }>
				<WelcomeScreen />
			</Provider>
		);
	}
}
***/}
