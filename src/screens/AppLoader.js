import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';
import i18nJs from 'i18n-js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { colors } from '../styles/variables';
import styles from '../styles';
import utcLogo from '../img/logo_utc.png';

import CASAuth from '../services/CASAuth';
import PortailApi from '../services/Portail';

import { getTranslationsFor } from '../utils/i18n';

const t = getTranslationsFor('screens.AppLoader');

export default class AppLoaderScreen extends React.Component {
	static loadLocale() {
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
			dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
			dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
		};

		LocaleConfig.defaultLocale = 'fr';
		i18nJs.locale = 'fr';
	}

	static loadFonts() {
		library.add(fas, far, fab);
	}

	static handleError(error) {
		console.warn(error);
	}

	constructor(props) {
		super(props);

		this.state = {
			text: '',
			screen: 'Welcome',
		};
	}

	componentWillMount() {
		this.bootstrap()
			.then(this.appLoaded.bind(this))
			.catch(error => AppLoaderScreen.handleError.bind(this, error));
	}

	// ========== App Bootstrapping Methods ==========

	// Load async data and store it in the App store
	async bootstrap() {
		// Download fonts, images etc...
		AppLoaderScreen.loadLocale();
		AppLoaderScreen.loadFonts();

		this.setState({
			text: t('loading'),
		});

		return PortailApi.autoLogin()
			.then(() => {
				this.setState(prevState => ({
					...prevState,
					isConnected: PortailApi.isConnected(),
				}));

				if (PortailApi.isConnected()) {
					this.setState(prevState => ({
						...prevState,
						text: 'Connexion...',
						screen: 'Home',
					}));

					return CASAuth.autoLogin().catch(() => true);
				}

				return true;
			})
			.catch(() => true);
	}

	appLoaded() {
		const { navigation } = this.props;
		const { screen } = this.state;

		navigation.navigate(screen);
	}

	render() {
		const { text } = this.state;

		return (
			<View style={styles.container.center}>
				<Image source={utcLogo} style={styles.img.logoStyle} resizeMode="contain" />
				<ActivityIndicator size="large" color={colors.yellow} />
				<Text
					style={[
						styles.get('text.h3', 'text.center', 'my.lg'),
						{ marginTop: 10, marginBottom: 50 },
					]}
				>
					{text}
				</Text>
			</View>
		);
	}
}
