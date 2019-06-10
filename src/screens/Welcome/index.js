import React from 'react';
// import { View, Image, Text, ScrollView, Dimensions } from 'react-native';
// import styles from '../../styles'
import Carousel from 'react-native-carousel';
import { colors } from '../../styles/variables';

import WelcomeMessageScreen from './WelcomeMessage';
import AppPurposeScreen from './AppPurpose';
import SetPreferencesScreen from './SetPreferences';

export default class WelcomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Bienvenue',
		headerStyle: {
			display: 'none',
		},
	};

	render() {
		const { navigation } = this.props;

		return (
			<Carousel
				indicatorOffset={-10}
				inactiveIndicatorColor={colors.gray}
				indicatorColor={colors.yellow}
				animate={false}
				indicatorSize={65}
			>
				<WelcomeMessageScreen />
				<AppPurposeScreen />
				<SetPreferencesScreen navigation={navigation} />
			</Carousel>
		);
	}
}
