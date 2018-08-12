import React from 'react';
import { View, Image, Text, WebView, StyleSheet, TouchableHighlight } from 'react-native';
import moment from 'moment'
import Button from 'react-native-button'
import styles from '../../styles'
import Spinner from 'react-native-loading-spinner-overlay'

// Components
import BigButton from '../../components/BigButton'
import HeaderView from '../../components/HeaderView'

import PortailApi from '../../services/Portail'
import Storage from '../../services/Storage'
import ColorUtils from '../../utils/Color'

export default class EventScreen extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			event: {},
			loading: true,
		}

		PortailApi.getEvent(5).then(([data]) => { // Debug
			this.setState(prevState => {
				prevState.event = data
				prevState.loading = false

				return prevState
			})
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
					<Spinner visible={this.state.loading} textContent="Chargement de l'évènement..." textStyle={{color: '#FFF'}} />
				</View>
				<HeaderView
					title="Connectez-vous"
					subtitle="Il est nécessaire pour le bon fonctionnement de l'application que vous vous connectiez au Portail des Assos. Si vous ne vous y êtes jamais connecté, veuillez vous connecter en tant que CAS"
				/>
				<View style={{ backgroundColor: '#F00', width: '100%', aspectRatio: 2 }}>
					<WebView style={{ flex: 1, width: '100%' }}
					    javaScriptEnabled={ true }
					    domStorageEnabled={ true }
					    startInLoadingState={ true }
						source={{ uri: 'https://www.openstreetmap.org/export/embed.html?bbox=2.8120923042297368,49.413939818144016,2.8210508823394775,49.41711913604144&layer=mapnik&marker=49.41552950283581,2.816571593284607' }}
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
