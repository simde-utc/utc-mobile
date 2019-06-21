/**
 * Encart de notification.
 *
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View, TouchableHighlight, Linking, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { PORTAIL_URL } from '../../../config';
import styles from '../../styles';
import { colors } from '../../styles/variables';

export default class Notification extends React.PureComponent {
	getIcon() {
		let icon;
		const {
			data: { type, icon: uri },
		} = this.props;

		if (uri) {
			return (
				<View style={styles.scrollable.item.icon}>
					<Image source={{ uri }} style={{ height: 22, width: 22 }} />
				</View>
			);
		}

		switch (type) {
			case 'user':
				icon = ['fas', 'user'];
				break;

			default:
				if (type) {
					icon = ['fas', type];
					break;
				} else {
					return;
				}
		}

		return (
			<View style={styles.scrollable.item.icon}>
				<FontAwesomeIcon icon={icon} size={22} style={styles.text.lightBlue} />
			</View>
		);
	}

	openLink() {
		const { data, navigation } = this.props;
		const { url } = data.action;

		switch (url) {
			case `${PORTAIL_URL}profile`:
				navigation.navigate('Profile');
				break;

			default:
				Linking.canOpenURL(url).then(supported => {
					if (supported) {
						Linking.openURL(url);
					}
				});
		}
	}

	render() {
		const { data, created_at, read_at } = this.props;
		const viewStyle = styles.scrollable.item.view;

		if (!read_at) {
			viewStyle.borderLeftColor = colors.lightBlue;
			viewStyle.borderLeftWidth = 5;
		}

		return (
			<TouchableHighlight
				onPress={() => this.openLink()}
				underlayColor="#007383"
				activeOpacity={0.7}
			>
				<View style={viewStyle}>
					{this.getIcon()}
					<View style={{ flex: 1 }}>
						<Text style={styles.scrollable.item.subsubtitle}>{created_at}</Text>

						<Text style={styles.scrollable.item.title}>{data.content}</Text>

						<Text style={styles.scrollable.item.subtitle}>
							{data.action.name} : {data.action.url}
						</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}
