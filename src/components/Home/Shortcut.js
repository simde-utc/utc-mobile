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

	getIcon() {
		const { icon } = this.props;
		let image;

		switch (icon) {
			case 'interactions':
				image = Interactions;
				break;

			case 'map':
				image = Map;
				break;

			default:
				break;
		}

		return <Image source={image} resizeMode="contain" style={styles.shortcut.icon} />;
	}

	render() {
		const { lazyTitle } = this.props;

		return (
			<TouchableHighlight
				style={styles.shortcut.view}
				onPress={() => this.onPress()}
				underlayColor="#007383"
				activeOpacity={0.7}
			>
				<View>
					<View style={styles.shortcut.iconView}>
						{this.getIcon()}
					</View>
					<View style={styles.shortcut.textView}>
						<Text style={styles.shortcut.text}>{_(lazyTitle)}</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}
