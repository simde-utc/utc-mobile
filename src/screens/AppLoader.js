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
				<Text>Chargement de l'application</Text>
			</View>
		);
	}


	// ========== App Bootstrapping Methods ==========

	// Load async data and store it in the App store
	bootstrap = async () => {
		// Fetch tokens from SecureStore...
		console.log("=== App Bootstrapping")
		this.setState(prevState => ({
			...prevState,
			isConnected: PortailApi.isConnected()
		}));

		// Download fonts, images etc...

		// Must return a Promise
		return new Promise(resolve => setTimeout(() => {
			console.log("=== App Bootstrapped")
			resolve()
		}, 500))
	}


	appLoaded = () => {
		console.log("=== App Loaded")
		this.props.navigation.navigate(
			this.state.isConnected ? 'Main' : 'Welcome'
		);
	}

	handleError(error) {
		console.warn(error)
	}
}
