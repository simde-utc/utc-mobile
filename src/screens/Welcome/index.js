import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';

import WelcomeMessageScreen from './WelcomeMessage';
import AppPurposeScreen from './AppPurpose';
import SetPreferencesScreen from './SetPreferences';
import styles from '../../styles';
import { _ } from '../../utils/i18n';

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
	static navigationOptions = () => ({
		title: _('welcome'),
		headerStyle: {
			display: 'none',
		},
	});

	renderSlide(slide) {
		const { navigation } = this.props;

		return <slide.screen navigation={navigation} />;
	}

	render() {
		return (
			<AppIntroSlider
				slides={slides}
				renderItem={this.renderSlide.bind(this)}
				dotStyle={styles.bg.gray}
				activeDotStyle={styles.bg.yellow}
				showNextButton={false}
				showDoneButton={false}
				paginationStyle = {{bottom: 0}}
			/>
		);
	}
}
