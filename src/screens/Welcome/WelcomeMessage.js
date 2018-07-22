import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../../styles'

export default class WelcomeMessageScreen extends React.Component {
	render() {
		const logoStyle = {
			width: 225,
			height: 150,
			marginBottom: 20
		}
		const titleStyle = [
			styles.yellowText,
			styles.h0,
			{
				textAlign: 'center',
				marginBottom: 10
			}
		]
		const subtitleStyle = [
			styles.grayText,
			styles.h4,
			{
				textAlign: 'center'
			}
		]
		return (
			<View style={styles.container}>
				<Image source={require('../../img/logo_utc.png')} style={ logoStyle } resizeMode={'center'} />
				<Text style={ titleStyle }>Bienvenue !</Text>
				<Text style={ subtitleStyle }>Découvrons ensemble l'application</Text>
			</View>
		);
	}
}
