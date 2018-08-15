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
			loading: false,
			loadingText: 'Connexion en cours...',
		}
	}

	connect () {
		this.setState(prevState => {
			prevState.loading = true

			return prevState
		})

		PortailApi.login(
			this.state.emailOrLogin,
			this.state.password
		).catch(([response, status]) => {
			this.setState(prevState => {
				prevState.loading = false

				return prevState
			})

			Alert.alert(
				'Connexion',
				'Votre adresse email et/ou votre mot de passe est incorrect',
				[
					{ text: 'Continuer' },
				],
				{ cancelable: true }
			)
		}).then(() => {
			this.setState(prevState => {
				prevState.loadingText = 'Enregistrement de l\'appareil...'

				return prevState
			})

			return PortailApi.createAppAuthentification()
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
				'Une erreur a été rencontrée lors de l\'enregistrement de l\'application. Réessayez',
				[
					{ text: 'Continuer' },
				],
				{ cancelable: true }
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
					subtitle="Il est nécessaire pour le bon fonctionnement de l'application que vous vous connectiez au Portail des Assos. Si vous ne vous y êtes jamais connecté, veuillez vous connecter en tant que CAS"
				/>
				<View style={ viewStyle }>
					<TextInput style={ styles.bigButton }
						underlineColorAndroid='transparent'
						placeHolder="Email / Login CAS"
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
						onPress={() => this.connect() }
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
