import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styles from '../styles/';
import { colors } from '../styles/variables';

import PortailApi from '../services/Portail';
import Storage from '../services/Storage';

export default class AppLoaderScreen extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			text: 'Chargement de l\'application',
		}
	}

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
					{ this.state.text }
				</Text>
			</View>
		);
	}


	// ========== App Bootstrapping Methods ==========

	// Load async data and store it in the App store
	bootstrap = async () => {
		// Download fonts, images etc...
		// Fetch tokens from SecureStore...
		return Storage.getSensitiveData('user').then((user) => {
			if (user) {
				this.setState(prevState => ({
					...prevState,
					text: 'Connexion de l\'application'
				}));

				return PortailApi.login(user.login, user.password)
			}
		}).then(() => {
			this.setState(prevState => ({
				...prevState,
				isConnected: PortailApi.isConnected()
			}));
		})
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
