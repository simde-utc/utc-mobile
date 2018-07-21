import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../../styles'

export default class WelcomeMessageScreen extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<Image source={require('../../img/logo_utc.png')} style={{ width: 200, height: 150, marginBottom: 50 }} resizeMode={'center'} />
				<Text style={[ styles.yellowText , styles.hugeText, { textAlign: 'center', marginBottom: 25 } ]}>Bienvenue !</Text>
				<Text style={[ styles.grayText, styles.largeText, { textAlign: 'center', marginBottom: 75 } ]}>Découvrons ensemble l'application</Text>
			</View>
		);
	}
}
