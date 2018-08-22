import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../../styles'

export default class WelcomeMessageScreen extends React.Component {
	render() {
		const titleStyle = styles.get('text.yellow', 'text.h0', 'text.center', 'mb.sm');
		const subtitleStyle = styles.get('text.gray', 'text.h4', 'text.center', 'mb.xl');

		return (
			<View style={ styles.container.center }>
				<Image source={require('../../img/logo_utc.png')} style={ styles.img.logoStyle } resizeMode={'center'} />
				<Text style={ titleStyle }>Bienvenue !</Text>
				<Text style={ subtitleStyle }>Découvrons ensemble l'application</Text>
			</View>
		);
	}
}
