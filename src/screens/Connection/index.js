/**
 * Affiche la page de connexion gérant l'interconnexion entre les comptes CAS et exté/app.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license GPL-3.0
 * */

import React from 'react';
import { View, TextInput, Alert } from 'react-native';
import Button from 'react-native-button';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from '../../styles';

// Components
import BigButton from '../../components/BigButton';
import HeaderView from '../../components/HeaderView';

// API
import PortailApi from '../../services/Portail';
import CASAuth from '../../services/CASAuth';

export default class ConnectionScreen extends React.Component {
	static navigationOptions = {
		title: 'Connexion',
		headerStyle: {
			display: 'none',
		},
	};

	constructor(props) {
		super(props);

		this.state = {
			emailOrLogin: '',
			password: '',
			allowEmail: false,
			forceCreation: false,
			loading: false,
			loadingText: 'Connexion en cours...',
		};
	}

	tryToConnect() {
		const { emailOrLogin, password, allowEmail } = this.state;

		if (emailOrLogin.length === 0 || password.length === 0) {
			Alert.alert(
				'Connexion',
				'Il est nécessaire de remplir les deux champs',
				[{ text: 'Continuer' }],
				{ cancelable: true }
			);
		} else if (emailOrLogin.includes('@') && !allowEmail) {
			this.setState(prevState => {
				prevState.allowEmail = true;

				return prevState;
			});

			Alert.alert(
				'Connexion',
				'Il est préférable de se connecter via son compte CAS. Cliquez sur continuer et sur "Se connecter" pour vous connecter',
				[{ text: 'Continuer' }],
				{ cancelable: true }
			);
		} else {
			this.connect();
		}
	}

	connect() {
		const { emailOrLogin, password, forceCreation } = this.state;

		this.setState(prevState => {
			prevState.loading = true;

			return prevState;
		});

		new Promise(() => {
			if (PortailApi.isConnected() && !emailOrLogin.includes('@') && !forceCreation) {
				if (emailOrLogin.includes('@') && !forceCreation) {
					this.setState(prevState => {
						prevState.forceCreation = true;
						prevState.loading = false;

						return prevState;
					});

					Alert.alert(
						'Connexion',
						'En vous connectant, vous allez perdre toutes vos préférences sur cette appareil et récupérer celles du compte. Cliquez sur continuer et sur "Se connecter" pour vous connecter',
						[{ text: 'Continuer' }],
						{ cancelable: false }
					);
				} else {
					return PortailApi.createCasAuthentification(emailOrLogin, password).catch(
						([_, status]) => {
							if (status === 400) {
								this.badLogin();

								return;
							}

							this.setState(prevState => {
								prevState.forceCreation = true;
								prevState.loading = false;

								return prevState;
							});

							Alert.alert(
								'Connexion',
								'En vous connectant, vous allez perdre toutes vos préférences sur cette appareil et récupérer celles du compte. Cliquez sur continuer et sur "Se connecter" pour vous connecter',
								[{ text: 'Continuer' }],
								{ cancelable: false }
							);
						}
					);
				}
			} else {
				return PortailApi.login(emailOrLogin, password)
					.then(() => {
						this.setState(prevState => {
							prevState.loadingText = "Enregistrement de l'appareil...";

							return prevState;
						});

						return PortailApi.createAppAuthentification()
							.then(() => {
								return this.register();
							})
							.catch(e => {
								console.warn(e);
								this.setState(prevState => {
									prevState.loading = false;

									return prevState;
								});

								Alert.alert(
									'Connexion',
									"Une erreur a été rencontrée lors de l'enregistrement de l'application. Réessayez",
									[{ text: 'Continuer' }],
									{ cancelable: false }
								);
							});
					})
					.catch(e => {
						console.log(e);
						this.badLogin();
					});
			}
		}).then(this.register);
	}

	register() {
		const { navigation } = this.props;
		const { emailOrLogin, password } = this.state;

		if (!emailOrLogin.includes('@')) {
			this.setState(prevState => {
				prevState.loadingText = 'Enregistrement des données CAS...';

				return prevState;
			});

			return CASAuth.setData(emailOrLogin, password)
				.catch(e => {
					console.log(e);

					this.setState(prevState => {
						prevState.loading = false;

						return prevState;
					});

					Alert.alert(
						'Connexion',
						'Une erreur a été rencontrée dans la sauvegarde de vos données CAS',
						[{ text: 'Continuer' }],
						{ cancelable: false }
					);

					navigation.navigate('Connected');
				})
				.then(() => {
					this.setState(prevState => {
						prevState.loading = false;

						return prevState;
					});

					navigation.navigate('Connected');
				});
		}

		this.setState(prevState => {
			prevState.loading = false;

			return prevState;
		});

		navigation.navigate('Connected');
	}

	badLogin() {
		this.setState(prevState => {
			prevState.loading = false;

			return prevState;
		});

		Alert.alert(
			'Connexion',
			"Votre login et/ou votre mot de passe est incorrect, ou cette version de l'application n'est pas autorisée à se connecter.",
			[{ text: 'Continuer' }],
			{ cancelable: true }
		);
	}

	render() {
		const { navigation } = this.props;
		const { loading, loadingText, emailOrLogin, password } = this.state;
		const viewStyle = [styles.get('container.default', 'bg.white', 'pt.xl', 'pb.xxl'), { flex: 7 }];

		return (
			<View style={styles.container.default}>
				<View>
					<Spinner
						visible={loading}
						textContent={loadingText}
						textStyle={{ width: 250, textAlign: 'center', color: '#FFF' }}
					/>
				</View>
				<HeaderView title="Connectez-vous" subtitle="pour utiliser pleinement l'application" />
				<View style={viewStyle}>
					<TextInput
						style={styles.bigButton}
						underlineColorAndroid="transparent"
						placeholder="Login CAS / Email"
						value={emailOrLogin}
						onChangeText={text =>
							this.setState(() => {
								return { emailOrLogin: text };
							})
						}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<TextInput
						style={styles.bigButton}
						underlineColorAndroid="transparent"
						placeholder="Mot de passe"
						value={password}
						onChangeText={text =>
							this.setState(() => {
								return { password: text };
							})
						}
						autoCapitalize="none"
						autoCorrect={false}
						secureTextEntry
					/>
					<BigButton
						label="Se connecter"
						style={styles.get('mt.lg', 'mb.md')}
						onPress={() => this.tryToConnect()}
					/>
					<Button style={styles.lightBlueText} onPress={() => navigation.navigate('Connected')}>
						Je ne souhaite pas me connecter
					</Button>
				</View>
			</View>
		);
	}
}
