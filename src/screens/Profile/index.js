/**
 * Affiche le profil de la personne
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { Text, View, Image } from 'react-native';
import styles from '../../styles'
import Spinner from 'react-native-loading-spinner-overlay'

// Components
import HeaderView from '../../components/HeaderView'
import BigButton from '../../components/BigButton';

// API
import PortailApi from '../../services/Portail'
import CASAuth from '../../services/CASAuth';

export default class ProfileScreen extends React.Component {
	static navigationOptions = {
		title: 'Compte',
		headerStyle: {
			display: 'none',
		}
	};

	constructor (props) {
		super(props)

		if (!PortailApi.isActive())
			props.navigation.navigate('Connection')

		this.state = {
			loading: false,
			login: '',
		}

		if (CASAuth.isConnected()) {
			CASAuth.getLogin().then((login) => {
				this.setState((prevState) => {
					prevState.login = login

					return prevState
				})
			})
		}

	}

	logout () {
		this.setState(prevState => {
			prevState.loading = true

			return prevState
		})

		PortailApi.logout().then(() => {
			this.setState(prevState => {
				prevState.loading = false

				return prevState
			})

			this.props.navigation.navigate('Connection')
		})
	}

	render () {
		const headerImagePath = CASAuth.isConnected() ? { uri: 'https://demeter.utc.fr/portal/pls/portal30/portal30.get_photo_utilisateur?username=' + this.state.login } : require('../../img/icon.png')
		const headerImageStyle = PortailApi.isConnected() ? styles.img.bigAvatar : styles.img.bigThumbnail
		const viewStyle = [
			styles.get('container.default', 'bg.white', 'pt.xl', 'pb.xxl'),
			{ flex: 7 }
		];

		return (
			<View style={ styles.container.default }>
				<View>
					<Spinner visible={ this.state.loading } textContent="Déconnexion en cours..." textStyle={{ color: '#FFF' }} />
				</View>
				<HeaderView>
						<Image style={ headerImageStyle } source={ headerImagePath } />
						<Text style={ styles.get('text.h1', 'text.yellow') }>{ PortailApi.getUser().name }</Text>
				</HeaderView>
				<View style={ viewStyle }>
					<Text style={[ styles.get('text.h2', 'text.center'), { margin: 20 } ]}>
						Bla bla bla bla des infos...
					</Text>
					<BigButton
						label="Se déconnecter"
						style={ styles.mt.lg }
						onPress={ () => { this.logout() } }
					/>
				</View>
			</View>
		);
	}
}
