import React from 'react';
import { View, Image, Text, WebView, StyleSheet, TouchableHighlight } from 'react-native';
import moment from 'moment'
import Button from 'react-native-button'
import styles from '../../styles'
import Spinner from 'react-native-loading-spinner-overlay'

// Components
import BigButton from '../../components/BigButton'
import HeaderView from '../../components/HeaderView'
import Map from '../../components/Map';

import PortailApi from '../../services/Portail'
import Storage from '../../services/Storage'
import ColorUtils from '../../utils/Color'

export default class EventScreen extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			event: {},
			loading: true,
			loaded: false,
		}

		PortailApi.getEvent('65690220-9fc8-11e8-96bf-4dbd26e1b167').then(([ event ]) => { // Debug
			this.setState(prevState => {
				prevState.event = event
				prevState.loading = false

				return prevState
			})

			if (this.state.loaded)
				this.setTarget()
		})
	}

	setTarget() {
		var position = this.state.event.location.position || this.state.event.location.place.position

		this.setState(prevState => {
			prevState.target = [
				position.coordinates[1],
				position.coordinates[0]
			]

			return prevState
		})
	}

	loaded() {
		this.setState(prevState => {
			prevState.loaded = true

			return prevState
		})

		if (!this.state.loading)
			this.setTarget()
	}

	render() {
		const viewStyle = [
			styles.get('container.default', 'bg.white', 'pt.xl', 'pb.xxl'),
			{ flex: 7 }
		];

		return (
			<View style={styles.container.default}>
				<View>
					<Spinner visible={this.state.loading} textContent="Chargement de l'évènement..." textStyle={{color: '#FFF'}} />
				</View>
				<HeaderView
					title="Connectez-vous"
					subtitle="Il est nécessaire pour le bon fonctionnement de l'application que vous vous connectiez au Portail des Assos. Si vous ne vous y êtes jamais connecté, veuillez vous connecter en tant que CAS"
				/>
				<View style={{ backgroundColor: '#F00', width: '100%', aspectRatio: 2 }}>
					<Map
						target={ this.state.target }
						loaded={ this.loaded.bind(this) }
					/>
				</View>
				<View style={ viewStyle }>
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
