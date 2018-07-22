import React from 'react';
import { View, Image, Text, TextInput } from 'react-native';
import styles from '../../styles'

// Components
import BigCheckBox from '../../components/BigCheckBox';
import BigButton from '../../components/BigButton';
import HeaderView from '../../components/HeaderView';

export default class ConnectionScreen extends React.Component {
	static navigationOptions = {
		title: 'Connexion',
		headerStyle: {
			display: 'none',
		}
	};

	connect() {
		return
	}

	render() {
		return (
			<View style={styles.containerStretched}>
				<HeaderView
					title="Connectez-vous"
					subtitle="Il est nécessaire pour le bon fonctionnement de l'application que vous vous connectiez au Portail des Assos. Si vous ne vous y êtes jamais connecté, veuillez vous connecter en tant que CAS"
				/>
				<View style={[styles.container, styles.whiteBg, {flex: 7, justifyContent: 'center', marginTop: 50, marginBottom: 75 }]}>
					<TextInput style={ styles.bigButton }
						placeHolder="Email / Login CAS"
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={ false }
					/>
					<TextInput style={ styles.bigButton }
						placeHolder="Mot de passe"
						autoCapitalize="none"
						autoCorrect={ false }
						secureTextEntry={ true }
					/>
					<BigButton label={ "Se connecter" }
						style={{ marginTop: 25}}
						onPress={() => this.connect()}
					/>
				</View>
			</View>
		);
	}
}
