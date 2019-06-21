/**
 * Page de chargement et de préparation des données.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Alexandre Brasseur <alexandre.brasseur@etu.utc.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { LocaleConfig } from 'react-native-calendars';
import i18nJs from 'i18n-js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import CASAuth from '../services/CASAuth';
import PortailApi from '../services/Portail';
import { colors } from '../styles/variables';
import styles from '../styles';
import utcLogo from '../img/logo_utc.png';
import Preferences from '../utils/Preferences';
import { _, AppLoader as t } from '../utils/i18n';

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

		LocaleConfig.defaultLocale = Preferences.LANG;
		i18nJs.locale = Preferences.LANG;
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

	getUserData() {
		return PortailApi.getAppData()
			.then(() => {
				this.setState({
					text: t('check_secure_data'),
				});

				return this.getCasData();
			})
			.catch(() => {
				this.setState({
					text: t('error_on_loading'),
					screen: 'Welcome',
				});

				return new Promise.all(PortailApi.forget(), CASAuth.forget());
			});
	}

	getCasData() {
		return CASAuth.getData()
			.then(data => {
				if (data) {
					this.setState({
						text: t('check_cas'),
					});

					return this.checkCasConnexion(data.ticket, data.login, data.password);
				}

				return true;
			})
			.catch(() => true);
	}

	checkCasConnexion(ticket, login, password) {
		return CASAuth.isTicketValid(ticket)
			.then(() => {
				return true;
			})
			.catch(() => {
				this.setState({
					text: t('connect_cas'),
				});

				return CASAuth.login(login, password)
					.then(() => {
						return CASAuth.setData(login, password);
					})
					.catch(() => this.reinitData());
			});
	}

	login(login, password) {
		return PortailApi.login(login, password)
			.then(() => {
				this.setState({
					text: t('get_user_data'),
				});

				// On récupère les données utilisateurs.
				return this.getUserData();
			})
			.catch(() => this.reinitData());
	}

	reinitData() {
		this.setState({
			text: t('reset_data'),
			screen: 'Welcome',
		});

		return new Promise.all(PortailApi.forget(), CASAuth.forget());
	}

	bootstrap() {
		// Download fonts, images etc...
		AppLoaderScreen.loadLocale();
		AppLoaderScreen.loadFonts();

		this.setState({
			text: _('loading'),
		});

		return PortailApi.getData()
			.then(data => {
				if (data) {
					this.setState({
						text: t('reconnection'),
						screen: 'Home',
					});

					// On connecte si on a bien de données de connexion stockées.
					return this.login(data.app_id, data.password);
				}

				return false;
			})
			.catch(() => {
				this.setState({
					text: t('go_intro'),
					screen: 'Welcome',
				});
			});
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
						styles.get('text.h3', 'text.center', 'text.h3'),
						{ height: 100, width: 250, marginTop: 10 },
					]}
				>
					{text}
				</Text>
			</View>
		);
	}
}
