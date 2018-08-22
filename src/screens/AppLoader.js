import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import styles from '../styles/';
import { colors } from '../styles/variables';

import CASAuth from '../services/CASAuth';
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
				<Image source={require('../img/logo_utc.png')} style={ styles.img.logoStyle } resizeMode={'center'} />
				<ActivityIndicator size="large" color={ colors.yellow }/>
				<Text style={[ styles.get('text.h3', 'text.center', 'my.lg'), { marginTop: 10, marginBottom: 50 } ]}>
					{ this.state.text }
				</Text>
			</View>
		);
	}


	// ========== App Bootstrapping Methods ==========

	// Load async data and store it in the App store
	bootstrap = async () => {
		// Download fonts, images etc...

		return PortailApi.autoLogin().then(() => {
			this.setState(prevState => ({
				...prevState,
				isConnected: PortailApi.isConnected()
			}));

			if (PortailApi.isConnected()) {
				this.setState(prevState => ({
					...prevState,
					text: 'Connexion...',
					screen: 'Home'
				}))

				return CASAuth.autoLogin().catch(() => true)
			}

			return true
		}).catch(() => true)
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
