import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styles from '../styles/';
import { colors } from '../styles/variables';
import PortailApi from '../services/Portail';

export default class AppLoaderScreen extends React.Component {
	componentWillMount() {
		this.bootstrap()
			.then(this.appLoaded.bind(this))
			.catch(error => this.handleError.bind(this, error))
	}

	render() {
		return (
			<View style={ styles.container.center }>
				<ActivityIndicator size="large" color={ colors.yellow }/>
				<Text style={ styles.get('text.h3', 'text.center', 'my.lg') }>
					Chargement de l'application
				</Text>
			</View>
		);
	}


	// ========== App Bootstrapping Methods ==========

	// Load async data and store it in the App store
	bootstrap = async () => {
		// Fetch tokens from SecureStore...
		this.setState(prevState => ({
			...prevState,
			isConnected: PortailApi.isConnected()
		}));

		// Download fonts, images etc...

		// Must return a Promise
		return new Promise(resolve => setTimeout(() => {
			resolve()
		}, 500))
	}


	appLoaded = () => {
		this.props.navigation.navigate(
			this.state.isConnected ? 'Main' : 'Welcome'
		);
	}

	handleError(error) {
		console.warn(error)
	}
}
