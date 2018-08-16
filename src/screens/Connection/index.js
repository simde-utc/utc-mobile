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
			loading: false,
			loadingText: 'Connexion en cours...',
		}
	}

	tryToConnect () {
		if (this.state.emailOrLogin.contains('@') && !this.state.allowEmail) {
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

		PortailApi.login(
			this.state.emailOrLogin,
			this.state.password
		).then(() => {
			this.setState(prevState => {
				prevState.loadingText = 'Enregistrement de l\'appareil...'

				return prevState
			})

			return PortailApi.createAppAuthentification()
		}).then(() => {
			if (!this.state.emailOrLogin.contains('@')) {
				this.setState(prevState => {
					prevState.loadingText = 'Enregistrement des données CAS...'

					return prevState
				})

				return CASAuth.setData(this.state.emailOrLogin, this.state.password).catch(() => {})
			}
		}).then(([response, status]) => {
			this.setState(prevState => {
				prevState.loading = false

				return prevState
			})

			this.props.navigation.navigate('Connected')
		}).catch(([response, status]) => {
			this.setState(prevState => {
				prevState.loading = false

				return prevState
			})

			Alert.alert(
				'Connexion',
				PortailApi.isConnected() ?
					'Une erreur a été rencontrée lors de l\'enregistrement de l\'application. Réessayez' :
					'Votre adresse email et/ou votre mot de passe est incorrect',
				[
					{ text: 'Continuer' },
				],
				{ cancelable: !PortailApi.isConnected() }
			)
		})
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
					subtitle="Il est nécessaire pour pouvoir utiliser pleinement l'application que vous vous connectiez"
				/>
				<View style={ viewStyle }>
					<TextInput style={ styles.bigButton }
						underlineColorAndroid='transparent'
						placeHolder="Login CAS / Email"
						value={ this.state.emailOrLogin }
						onChangeText={(text) => this.setState(() => { return { emailOrLogin: text } })}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={ false }
					/>
					<TextInput style={ styles.bigButton }
						underlineColorAndroid='transparent'
						placeHolder="Mot de passe"
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
