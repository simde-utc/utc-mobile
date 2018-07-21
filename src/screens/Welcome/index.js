import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';
import styles from '../../styles'
import { colors } from '../../styles/variables';

var Carousel = require('react-native-carousel');

import WelcomeMessageScreen from './WelcomeMessage';
import AppPurposeScreen from './AppPurpose';
import SetPreferencesScreen from './SetPreferences';

export default class WelcomeScreen extends React.Component {
	render() {
		return (
			<Carousel
				indicatorOffset={0}
				inactiveIndicatorColor={colors.gray}
				indicatorColor={colors.yellow}
				animate={false}
				indicatorSize={50}
			>
				<WelcomeMessageScreen />
				<AppPurposeScreen />
				<SetPreferencesScreen />
				<View style={styles.container}>
					<Text>Connexion</Text>
				</View>
			</Carousel>
		);

		/*
		AUTRE SOLUTION : Avec ScrollView
		const width = Dimensions.get('window').width
		const imageLayout = {
			width: 	width,
			height: width/2,
		}
		return (
			<ScrollView pagingEnabled directionalLockEnabled horizontal>
				<Image source={require('../img/logo_utc.png')} style={imageLayout} resizeMode={'center'} />
				<Image source={require('../img/logo_utc.png')} style={imageLayout} resizeMode={'center'} />
				<Image source={require('../img/logo_utc.png')} style={imageLayout} resizeMode={'center'} />
			</ScrollView>
		)
		*/
	}
}
