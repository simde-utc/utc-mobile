import React from 'react';
import { TouchableHighlight, View, Text, Image } from 'react-native';

import Interactions from '../../img/icons/interactions.png';
import Map from '../../img/icons/map.png';
import styles from '../../styles';
import { _ } from '../../utils/i18n';

export default class Shortcut extends React.Component {
	onPress() {
		const { navigation, screen } = this.props;

		navigation.navigate(screen);
	}

	getIconSource() {
		const { icon } = this.props;

		switch (icon) {
			case 'interactions':
				return Interactions;

			case 'map':
				return Map;

			default:
		}
	}

	getIcon() {
		return (
			<Image source={this.getIconSource()} resizeMode="contain" style={styles.shortcut.icon} />
		);
	}

	getTitleText() {
		const { lazyTitle } = this.props;

		return _(lazyTitle);
	}

	getTitle() {
		return <Text style={styles.shortcut.text}>{this.getTitleText()}</Text>;
	}

	render() {
		return (
			<TouchableHighlight
				style={styles.shortcut.view}
				onPress={() => this.onPress()}
				underlayColor="#007383"
				activeOpacity={0.7}
			>
				<View>
					<View style={styles.shortcut.iconView}>{this.getIcon()}</View>
					<View style={styles.shortcut.textView}>{this.getTitle()}</View>
				</View>
			</TouchableHighlight>
		);
	}
}
