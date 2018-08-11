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
			screen: 'Welcome'
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
					text: 'Reconnexion'
				}))

				return PortailApi.connect(user.token).catch(() => {
					return PortailApi.login(user.login, user.password).catch(() => {
						this.setState(prevState => ({
							...prevState,
							text: 'Application déconnectée',
							screen: 'Connection'
						}));

						return PortailApi.forget()
					})
				})
			}
		}).then(() => {
			this.setState(prevState => ({
				...prevState,
				isConnected: PortailApi.isConnected()
			}));

			if (PortailApi.isConnected()) {
				this.setState(prevState => ({
					...prevState,
					screen: 'Home'
				}));
			}
		})
	}


	appLoaded = () => {
		this.props.navigation.navigate(
			this.state.screen
		);
	}

	handleError(error) {
		console.warn(error)
	}
}
