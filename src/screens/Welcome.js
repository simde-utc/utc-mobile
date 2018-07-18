import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../styles'
import { colors } from '../styles/variables';

import CheckBox from 'react-native-checkbox-svg';
var Carousel = require('react-native-carousel');

export default class WelcomeScreen extends React.Component {
	render() {

		return (
<Carousel indicatorOffset={20} inactiveIndicatorColor={colors.gray} indicatorColor={colors.yellow} animate={false} indicatorSize={70}>
			<View style={styles.container}>
				<Image source={require('../img/logo_utc.png')} style={{ width: 200, height: 150 }} resizeMode={'center'} />
				<Text style={[ styles.yellowText , styles.hugeText, { textAlign: 'center' } ]}>Bienvenue !</Text>
				<Text style={[ styles.grayText, styles.largeText, { textAlign: 'center' } ]}>Découvrons ensemble l'application</Text>
			</View>
			<View style={styles.container}>
				<Text>Profilage</Text>
			</View>
			<View style={styles.container}>
				<Text>Connexion</Text>
			</View>
</Carousel>
		);
	}
}
