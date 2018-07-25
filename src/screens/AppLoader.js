import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styles from '../styles/';
import { colors } from '../styles/variables';

export default class AppLoaderScreen extends React.Component {
	componentDidMount() {
		// Fetch tokens...
		let data = {
			isConnected: true
		}

		// DEBUG
		setTimeout(this.onAppLoaded.bind(this, data), 500);
	}

	onAppLoaded(data) {
		this.props.navigation.navigate(
			data.isConnected ? 'Main' : 'Welcome'
		);
	}

	render() {
		return (
			<View style={ styles.container.center }>
				<ActivityIndicator size="large" color={ colors.yellow }/>
				<Text>Chargement de l'application</Text>
			</View>
		);
	}
}
