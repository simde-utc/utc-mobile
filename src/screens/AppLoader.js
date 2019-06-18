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

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { colors } from '../styles/variables';
import styles from '../styles';
import utcLogo from '../img/logo_utc.png';

import CASAuth from '../services/CASAuth';
import PortailApi from '../services/Portail';

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
			text: "Chargement de l'application",
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
					text: 'Vérification des données chiffrées',
				});

				return this.getCasData();
			})
			.catch(() => {
				this.setState({
					text: 'Erreur lors de la récupération des données',
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
						text: 'Vérification de la connexion CAS-UTC',
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
					text: 'Reconnexion au CAS-UTC',
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
					text: 'Récupération des données utilisateurs',
				});

				// On récupère les données utilisateurs.
				return this.getUserData();
			})
			.catch(() => this.reinitData());
	}

	reinitData() {
		this.setState({
			text: 'Réinitialisation des données',
			screen: 'Welcome',
		});

		return new Promise.all(PortailApi.forget(), CASAuth.forget());
	}

	bootstrap() {
		// Download fonts, images etc...
		AppLoaderScreen.loadLocale();
		AppLoaderScreen.loadFonts();

		return PortailApi.getData()
			.then(data => {
				if (data) {
					this.setState({
						text: 'Reconnexion',
						screen: 'Home',
					});

					// On connecte si on a bien de données de connexion stockées.
					return this.login(data.app_id, data.password);
				}

				return false;
			})
			.catch(() => {
				this.setState({
					text: "Affichage de l'introduction",
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
						styles.get('text.h3', 'text.center', 'my.lg'),
						{ height: 100, width: 250, marginTop: 10 },
					]}
				>
					{text}
				</Text>
			</View>
		);
	}
}
