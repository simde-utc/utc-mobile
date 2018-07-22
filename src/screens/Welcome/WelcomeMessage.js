import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../../styles'

export default class WelcomeMessageScreen extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<Image source={require('../../img/logo_utc.png')} style={{ width: 225, height: 150, marginBottom: 25 }} resizeMode={'center'} />
				<Text style={[ styles.yellowText , styles.h0, { textAlign: 'center', marginBottom: 20 } ]}>Bienvenue !</Text>
				<Text style={[ styles.grayText, styles.h4, { textAlign: 'center', marginBottom: 80 } ]}>Découvrons ensemble l'application</Text>
			</View>
		);
	}
}
