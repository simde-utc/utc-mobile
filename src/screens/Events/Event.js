import React from 'react';
import { View, Image, Text, WebView, StyleSheet, TouchableHighlight } from 'react-native';
import moment from 'moment'
import Button from 'react-native-button'
import styles from '../../styles'
import Spinner from 'react-native-loading-spinner-overlay'
import openMap from 'react-native-open-maps';

// Components
import BigButton from '../../components/BigButton'
import HeaderView from '../../components/HeaderView'
import Map from '../../components/Map';

import PortailApi from '../../services/Portail'
import Storage from '../../services/Storage'
import ColorUtils from '../../utils/Color'

export default class EventScreen extends React.Component {
	static navigationOptions = ({ navigation, navigationOptions }) => {
		return {
			title: navigation.getParam('name', 'Evènement'),
		}
    }

	constructor(props) {
		super(props)

		this.state = {
			event: {},
			calendars: [],
			loading: true,
			loaded: false,
		}

		PortailApi.getUserCalendars().then(([calendars]) => {
			this.setState(prevState => {
				prevState.calendars = calendars

				return prevState
			})
		}).catch(() => {})

		PortailApi.getEvent(props.navigation.getParam('id')).then(([event]) => {
			console.log(event)
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

	goMap() {
		if (!this.state.loading) {
			var position = this.state.event.location.position || this.state.event.location.place.position

			openMap({
				latitude: position.coordinates[1],
				longitude: position.coordinates[0],
			})
		}
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
				<TouchableHighlight style={{ backgroundColor: '#F00', width: '100%', aspectRatio: 2 }}
					onPress={ () => this.goMap() }
					underlayColor={"#fff0"}
				>
					<Map
						target={ this.state.target }
						loaded={ this.loaded.bind(this) }
					/>
				</TouchableHighlight>
				<Text>
					{ this.state.event.name }
				</Text>
				<Text>
					{ this.state.event.owned_by && this.state.event.owned_by.name }
				</Text>
				<View style={ viewStyle }>
					<BigButton label="Ajouter dans un calendrier"
						style={ styles.get('mt.lg', 'mb.md') }
						onPress={() => this.connect() }
					/>
					<BigButton label="Partager"
						style={ styles.get('mt.lg', 'mb.md') }
						onPress={() => this.connect() }
					/>
				</View>
			</View>
		);
	}
}
