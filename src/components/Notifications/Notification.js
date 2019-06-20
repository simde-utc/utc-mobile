/**
 * Encart de notification
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View, TouchableHighlight, Linking } from 'react-native';
import styles from '../../styles';

export default class Notification extends React.PureComponent {
	openLink() {
		const { data } = this.props;
		const url = data.item.data.action;

		Linking.canOpenURL(url).then(supported => {
			if (supported) {
				Linking.openURL(url);
			}
		});
	}

	render() {
		const { data } = this.props;

		return (
			<TouchableHighlight
				onPress={() => this.openLink()}
				style={styles.scrollable.item.largeView}
				underlayColor="#fff"
			>
				<View style={{ flex: 1 }}>
					<Text style={styles.scrollable.item.subsubtitle}>{data.item.created_at}</Text>

					<Text style={styles.scrollable.item.title}>{data.item.data.content}</Text>

					<Text style={styles.scrollable.item.subtitle}>
						{data.item.data.action.name} : {data.item.data.action.url}
					</Text>
				</View>
			</TouchableHighlight>
		);
	}
}
