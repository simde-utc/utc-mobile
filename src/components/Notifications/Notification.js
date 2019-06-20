/*
 * Encart de notification
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license AGPL-3.0
 */

import React from 'react'
import { Text, View } from 'react-native';
import styles from '../../styles';

export default class Notification extends React.PureComponent {
	render() {
		const {data} = this.props;

		return (
			<View style={styles.scrollable.item.view}>
				<View style={{flex: 1}}>
					<Text style={styles.scrollable.item.title}>Titre</Text>
					<Text style={styles.scrollable.item.subsubtitle}>Sous-titre</Text>
				</View>
			</View>
		);
	}
}

