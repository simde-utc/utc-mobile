import React from 'react';
import { Text, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay'

import styles from '../../styles'

// Components
import HeaderView from '../../components/HeaderView'
import BigButton from '../../components/BigButton';

// API
import PortailApi from '../../services/Portail'

export default class ConnectedScreen extends React.Component {
	static navigationOptions = {
		title: 'Connected',
		headerStyle: {
			display: 'none',
		}
	};

	constructor (props) {
		super(props)

		this.state = {
			loading: false
		}

		if (PortailApi.isActive()) {
			this.state.subTitle = "Vous êtes maintenant connecté.e sous " + PortailApi.getUser().name + " !"
			this.state.more = "et tout ceci, de manière personnalisée"
		}
		else
			this.state.subTitle = "Vous n'êtes connecté.e sous aucun compte"

		if (!PortailApi.isConnected()) {
			this.state.loading = true

			PortailApi.createInvitedAccount().then(() => {
				this.setState(prevState => {
					prevState.loading = false

					return prevState
				})
			}).catch(([response, status]) => {
				Alert.alert(
					'Enregistrement',
					'Une erreur a été détectée lors de l\'enregistrement de l\'application. Veuillez relancer l\'application',
					[
						{ text: 'Continuer' },
					],
					{ cancelable: false }
				)

				this.setState(prevState => {
					prevState.loading = false

					return prevState
				})
			})
		}
	}

	render () {
		const viewStyle = [
			styles.get('container.default', 'bg.white', 'pt.xl', 'pb.xxl'),
			{ flex: 7 }
		];

		return (
			<View style={ styles.container.default }>
				<View>
					<Spinner visible={ this.state.loading } textContent="Enregistrement de l'application..." textStyle={{ color: '#FFF' }} />
				</View>
				<HeaderView
					title="Bienvenue !"
					subtitle={ this.state.subTitle }
				/>
				<View style={ viewStyle }>
					<Text style={[ styles.get('text.h2', 'text.center'), { margin: 20 } ]}>
						Vous pouvez dès à présent utiliser toutes les fonctionnalités de l'application { this.state.more }!
					</Text>
					<BigButton
						label="Aller à la page d'accueil"
						style={ styles.mt.lg }
						onPress={ () => this.props.navigation.navigate('Main') }
					/>
				</View>
			</View>
		);
	}
}
