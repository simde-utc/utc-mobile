/**
 * Affiche la page connecté. Connecte l'application si l'application ne l'est pas ou qu'elle est lancée en tant qu'invité
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
 * */

import React from 'react';
import { Text, View, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import styles from '../../styles';

// Components
import HeaderView from '../../components/HeaderView';
import BigButton from '../../components/BigButton';

// API
import PortailApi from '../../services/Portail';

export default class ConnectedScreen extends React.Component {
	static navigationOptions = {
		title: 'Connected',
		headerStyle: {
			display: 'none',
		},
	};

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
		};

		if (PortailApi.isActive()) {
			this.state.subTitle = `${PortailApi.getUser().name}, vous êtes connecté !`;
			this.state.more = 'et à la personnaliser';
		} else this.state.subTitle = "Vous n'êtes connecté.e sous aucun compte";

		if (!PortailApi.isConnected()) {
			this.state.loading = true;

			PortailApi.createInvitedAccount()
				.then(() => {
					this.setState(prevState => {
						prevState.loading = false;

						return prevState;
					});
				})
				.catch(() => {
					Alert.alert(
						'Enregistrement',
						"Une erreur a été détectée lors de l'enregistrement de l'application. Veuillez relancer l'application",
						[{ text: 'Continuer' }],
						{ cancelable: false }
					);

					this.setState(prevState => {
						prevState.loading = false;

						return prevState;
					});
				});
		}
	}

	render() {
		const { navigation } = this.props;
		const { loading, subTitle, more } = this.state;
		const viewStyle = [styles.get('container.default', 'bg.white', 'pt.xl', 'pb.xxl'), { flex: 7 }];

		return (
			<View style={styles.container.default}>
				<View>
					<Spinner
						visible={loading}
						textContent="Enregistrement de l'application..."
						textStyle={{ color: '#FFF' }}
					/>
				</View>
				<HeaderView title="Bienvenue !" subtitle={subTitle} />
				<View style={viewStyle}>
					<Text style={[styles.get('text.h2', 'text.center'), { margin: 20 }]}>
						Vous êtes prêt à utiliser l'application {more}!
					</Text>
					<BigButton
						label="Aller à la page d'accueil"
						style={styles.mt.lg}
						onPress={() => navigation.navigate('Accueil')}
					/>
				</View>
			</View>
		);
	}
}
