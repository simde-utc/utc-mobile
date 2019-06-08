import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';
// import styles from '../../styles'
import { colors } from '../../styles/variables';

// import Carousel from 'react-native-carousel';

import WelcomeMessageScreen from './WelcomeMessage';
import AppPurposeScreen from './AppPurpose';
import SetPreferencesScreen from './SetPreferences';

export default class WelcomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Bienvenue',
		headerStyle: {
			display: 'none',
		}
	};

	render() {
		// return (
		// 	<Carousel
		// 		indicatorOffset={-10}
		// 		inactiveIndicatorColor={colors.gray}
		// 		indicatorColor={colors.yellow}
		// 		animate={false}
		// 		indicatorSize={65}
		// 	>
		// 		<WelcomeMessageScreen />
		// 		<AppPurposeScreen />
		// 		<SetPreferencesScreen navigation={ this.props.navigation }/>
		// 	</Carousel>
		// );

		//AUTRE SOLUTION : Avec ScrollView
		const width = Dimensions.get('window').width;
		const imageLayout = {
			width: 	width,
			height: width/2,
		};
		return (
			<ScrollView pagingEnabled directionalLockEnabled horizontal>
				<Image source={require('../../img/logo_utc.png')} style={imageLayout} resizeMode={'center'} />
				<Image source={require('../../img/logo_utc.png')} style={imageLayout} resizeMode={'center'} />
				<Image source={require('../../img/logo_utc.png')} style={imageLayout} resizeMode={'center'} />
			</ScrollView>
		);
	}
}
