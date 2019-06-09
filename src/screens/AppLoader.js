import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';
import styles from '../styles/';
import { colors } from '../styles/variables';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

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
				<Image source={require('../img/logo_utc.png')} style={ styles.img.logoStyle } resizeMode={'contain'} />
				<ActivityIndicator size="large" color={ colors.yellow }/>
				<Text style={[ styles.get('text.h3', 'text.center', 'my.lg'), { marginTop: 10, marginBottom: 50 } ]}>
					{ this.state.text }
				</Text>
			</View>
		);
	}


	// ========== App Bootstrapping Methods ==========

	// Load async data and store it in the App store
	async bootstrap() {
		// Download fonts, images etc...
		this.loadLocale()
		this.loadFonts();

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

	loadLocale() {
		LocaleConfig.locales.fr = {
		  monthNames: [
		    'Janvier',
		    'Février',
		    'Mars',
		    'Avril',
		    'Mai',
		    'Juin',
		    'Juillet',
		    'Août',
		    'Septembre',
		    'Octobre',
		    'Novembre',
		    'Décembre',
		  ],
		  monthNamesShort: [
		    'Janv.',
		    'Févr.',
		    'Mars',
		    'Avril',
		    'Mai',
		    'Juin',
		    'Juil.',
		    'Août',
		    'Sept.',
		    'Oct.',
		    'Nov.',
		    'Déc.',
		  ],
		  dayNames: [
		    'Dimanche',
		    'Lundi',
		    'Mardi',
		    'Mercredi',
		    'Jeudi',
		    'Vendredi',
		    'Samedi',
		  ],
		  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
		};

		LocaleConfig.defaultLocale = 'fr';
	}

	loadFonts() {
		library.add(fas, far, fab);
	}

	appLoaded() {
		this.props.navigation.navigate(
			this.state.screen
		);
	}

	handleError(error) {
		console.warn(error)
	}
}
