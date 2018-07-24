import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';

import WelcomeScreen from './src/screens/Welcome/';
import MainLayout from './src/screens/MainLayout';

export default class App extends React.Component {
	render() {
		// TODO
		const hasSeenIntro = true;
		const isConnected = false;

		return (
			<Provider store={ store }>
				{ hasSeenIntro
					? <MainLayout />
					: <WelcomeScreen />
				}
			</Provider>
		);
	}
}
