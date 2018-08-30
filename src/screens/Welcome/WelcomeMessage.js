import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../../styles'

const titleStyle = styles.get('text.yellow', 'text.h0', 'text.center', 'mb.sm');
const subtitleStyle = styles.get('text.gray', 'text.h4', 'text.center', 'mb.xl');
const subsubtitleStyle = styles.get('text.lightGray', 'text.h5', 'text.center', 'mb.xs');

export default class WelcomeMessageScreen extends React.Component {
	render() {
		return (
			<View style={ styles.container.center }>
				<Image source={require('../../img/logo_utc.png')} style={ styles.img.logoStyle } resizeMode={'center'} />
				<Text style={ titleStyle }>Bienvenue !</Text>
				<Text style={[ subtitleStyle, { marginBottom: 50 } ]}>Découvrons ensemble l'application</Text>
				<View style={{ position: 'absolute', bottom: 50 }}>
					<Text style={ subsubtitleStyle }>Glissez vers la droite pour commencer</Text>
				</View>
			</View>
		);
	}
}
