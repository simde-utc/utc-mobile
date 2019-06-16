import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { colors } from '../../styles/variables';

import WelcomeMessageScreen from './WelcomeMessage';
import AppPurposeScreen from './AppPurpose';
import SetPreferencesScreen from './SetPreferences';

const slides = [
	{
		key: 'Welcome',
		screen: WelcomeMessageScreen,
	},
	{
		key: 'AppPurpose',
		screen: AppPurposeScreen,
	},
	{
		key: 'SetPreferences',
		screen: SetPreferencesScreen,
	},
];

export default class WelcomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Bienvenue',
		headerStyle: {
			display: 'none',
		},
	};

	static renderSlide(slide) {
		return <slide.screen />;
	}

	render() {
		return (
			<AppIntroSlider
				slides={slides}
				renderItem={WelcomeScreen.renderSlide}
				dotStyle={{ backgroundColor: colors.gray }}
				activeDotStyle={{ backgroundColor: colors.yellow }}
				showNextButton={false}
				showDoneButton={false}
			/>
		);
	}
}
