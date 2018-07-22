import React from 'react'
import { View, Image, Text, TextInput } from 'react-native'
import Button from 'react-native-button'
import { resetNavigation } from '../../utils/navigation'
import styles from '../../styles'

// Components
import BigCheckBox from '../../components/BigCheckBox'
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
			password: ''
		}
	}

	connect () {
		PortailApi.login(
			this.state.emailOrLogin,
			this.state.password
		).then(() => resetNavigation(this.props.navigation, 'Connected'))
	}

	render () {
		return (
			<View style={styles.containerStretched}>
				<HeaderView
					title="Connectez-vous"
					subtitle="Il est nécessaire pour le bon fonctionnement de l'application que vous vous connectiez au Portail des Assos. Si vous ne vous y êtes jamais connecté, veuillez vous connecter en tant que CAS"
				/>
				<View style={[styles.container, styles.whiteBg, {flex: 7, justifyContent: 'center', marginTop: 50, marginBottom: 75 }]}>
					<TextInput style={ styles.bigButton }
						placeHolder="Email / Login CAS"
						value={ this.state.emailOrLogin }
						onChangeText={(text) => this.setState(() => { return { emailOrLogin: text } })}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={ false }
					/>
					<TextInput style={ styles.bigButton }
						placeHolder="Mot de passe"
						value={ this.state.password }
						onChangeText={(text) => this.setState(() => { return { password: text } })}
						autoCapitalize="none"
						autoCorrect={ false }
						secureTextEntry={ true }
					/>
					<BigButton label={ "Se connecter" }
						style={{ marginTop: 25, marginBottom: 15 }}
						onPress={() => this.connect()}
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
