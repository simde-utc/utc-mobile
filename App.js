import React from 'react';
import { Provider } from 'react-redux';

import store from './src/redux/store';
import WelcomeScreen from './src/screens/Welcome';

export default class App extends React.Component {
	render() {
		return (
			<Provider store={ store }>
				<WelcomeScreen />
			</Provider>
		);
	}
}
