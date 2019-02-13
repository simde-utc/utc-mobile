/**
 * Affiche la page de connexion gérant l'interconnexion entre les comptes CAS et exté/app
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react'
import { View, Image, Text, TextInput, Alert } from 'react-native'
import Button from 'react-native-button'
import styles from '../../styles'
import Spinner from 'react-native-loading-spinner-overlay'

// Components
import BigButton from '../../components/BigButton'
import HeaderView from '../../components/HeaderView'

// API
import PortailApi from '../../services/Portail'
import CASAuth from '../../services/CASAuth'

export default class ConnectionScreen extends React.Component {
	static navigationOptions = {
		title: 'Connexion',
		headerStyle: {
			display: 'none',
		}
	};

	constructor (props) {
		super(props)

		this.state = {
			emailOrLogin: '',
			password: '',
			allowEmail: false,
			forceCreation: false,
			loading: false,
			loadingText: 'Connexion en cours...',
		}
	}

	tryToConnect () {
		if (this.state.emailOrLogin.length === 0 || this.state.password.length === 0) {
			Alert.alert(
				'Connexion',
				'Il est nécessaire de remplir les deux champs',
				[
					{ text: 'Continuer' },
				],
				{ cancelable: true }
			)
		}
		else if (this.state.emailOrLogin.includes('@') && !this.state.allowEmail) {
			this.setState(prevState => {
				prevState.allowEmail = true

				return prevState
			})

			Alert.alert(
				'Connexion',
				'Il est préférable de se connecter via son compte CAS. Cliquez sur continuer et sur "Se connecter" pour vous connecter',
				[
					{ text: 'Continuer' },
				],
				{ cancelable: true }
			)
		}
		else
			this.connect()
	}

	connect () {
		this.setState(prevState => {
			prevState.loading = true

			return prevState
		})

		new Promise(() => {
			if (PortailApi.isConnected() && !this.state.emailOrLogin.includes('@') && !this.state.forceCreation) {
				if (this.state.emailOrLogin.includes('@') && !this.state.forceCreation) {
					this.setState(prevState => {
						prevState.forceCreation = true
						prevState.loading = false

						return prevState
					})

					Alert.alert(
						'Connexion',
						'En vous connectant, vous allez perdre toutes vos préférences sur cette appareil et récupérer celles du compte. Cliquez sur continuer et sur "Se connecter" pour vous connecter',
						[
							{ text: 'Continuer' },
						],
						{ cancelable: false }
					)
				}
				else {
					return PortailApi.createCasAuthentification(this.state.emailOrLogin, this.state.password).catch(([response, status]) => {
						if (status === 400) {
							this.badLogin()

							return;
						}

						this.setState(prevState => {
							prevState.forceCreation = true
							prevState.loading = false

							return prevState
						})

						Alert.alert(
							'Connexion',
							'En vous connectant, vous allez perdre toutes vos préférences sur cette appareil et récupérer celles du compte. Cliquez sur continuer et sur "Se connecter" pour vous connecter',
							[
								{ text: 'Continuer' },
							],
							{ cancelable: false }
						)
					})
				}
			}
			else {
				return PortailApi.login(
					this.state.emailOrLogin,
					this.state.password
				).then(() => {
					this.setState(prevState => {
						prevState.loadingText = 'Enregistrement de l\'appareil...'

						return prevState
					})

					return PortailApi.createAppAuthentification().then(() => {
						return this.register()
					}).catch(([response, status]) => {
						this.setState(prevState => {
							prevState.loading = false

							return prevState
						})

						Alert.alert(
							'Connexion',
							'Une erreur a été rencontrée lors de l\'enregistrement de l\'application. Réessayez',
							[
								{ text: 'Continuer' },
							],
							{ cancelable: false }
						)
					})
				}).catch(() => {
					this.badLogin()
				})
			}
		}).then(this.register)
	}

	register () {
		new Promise((resolve, reject) => {
			if (!this.state.emailOrLogin.includes('@')) {
				this.setState(prevState => {
					prevState.loadingText = 'Enregistrement des données CAS...'

					return prevState
				})

				return CASAuth.setData(this.state.emailOrLogin, this.state.password).catch(([response, status]) => {
					this.setState(prevState => {
						prevState.loading = false

						return prevState
					})

					Alert.alert(
						'Connexion',
						'Une erreur a été rencontrée dans la sauvegarde de vos données CAS',
						[
							{ text: 'Continuer' },
						],
						{ cancelable: false }
					)

					this.props.navigation.navigate('Connected')
				}).then(() => {
					this.setState(prevState => {
						prevState.loading = false

						return prevState
					})

					this.props.navigation.navigate('Connected')
				})
			}

			this.setState(prevState => {
				prevState.loading = false

				return prevState
			})

			this.props.navigation.navigate('Connected')
		})
	}

	badLogin () {
		this.setState(prevState => {
			prevState.loading = false

			return prevState
		})

		Alert.alert(
			'Connexion',
			'Votre login et/ou votre mot de passe est incorrect, ou cette version de l\'application n\'est pas autorisée à se connecter.',
			[
				{ text: 'Continuer' },
			],
			{ cancelable: true }
		)
	}

	render() {
		const viewStyle = [
			styles.get('container.default', 'bg.white', 'pt.xl', 'pb.xxl'),
			{ flex: 7 }
		];

		return (
			<View style={styles.container.default}>
				<View>
					<Spinner visible={this.state.loading} textContent={ this.state.loadingText } textStyle={{ color: '#FFF' }} />
				</View>
				<HeaderView
					title="Connectez-vous"
					subtitle="pour utiliser pleinement l'application"
				/>
				<View style={ viewStyle }>
					<TextInput style={ styles.bigButton }
						underlineColorAndroid='transparent'
						placeholder="Login CAS / Email"
						value={ this.state.emailOrLogin }
						onChangeText={(text) => this.setState(() => { return { emailOrLogin: text } })}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={ false }
					/>
					<TextInput style={ styles.bigButton }
						underlineColorAndroid='transparent'
						placeholder="Mot de passe"
						value={ this.state.password }
						onChangeText={(text) => this.setState(() => { return { password: text } })}
						autoCapitalize="none"
						autoCorrect={ false }
						secureTextEntry={ true }
					/>
					<BigButton label={ "Se connecter" }
						style={ styles.get('mt.lg', 'mb.md') }
						onPress={() => this.tryToConnect() }
					/>
					<Button style={ styles.lightBlueText }
						onPress={ (checked) => this.props.navigation.navigate('Connected') }
					>
						Je ne souhaite pas me connecter
					</Button>
				</View>
			</View>
		);
	}
}
