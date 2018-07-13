import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../styles'

export default class WelcomeScreen extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<Image source={require('../img/logo_utc.png')} style={{ width: 200, height: 150 }} resizeMode={'center'} />
				<Text style={[ styles.yellowText , styles.hugeText, { textAlign: 'center' } ]}>Bienvenue !</Text>
				<Text style={[ styles.grayText, styles.largeText, { textAlign: 'center' } ]}>Découvrons ensemble l'application</Text>
			</View>
		);
	}
}
