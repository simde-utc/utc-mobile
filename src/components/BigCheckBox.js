import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { colors } from '../styles/variables';
import styles from '../styles';

export default class BigCheckBox extends React.Component {
	getCheckBox() {
		const { checked } = this.props;

		return (
			<FontAwesomeIcon
				icon={['far', checked ? 'check-square' : 'square']}
				size={22}
				style={{ marginRight: 10, color: colors.yellow }}
			/>
		);
	}

	render() {
		const { onPress, labelStyle, label } = this.props;

		return (
			<TouchableHighlight onPress={onPress} underlayColor="#fff0">
				<View style={styles.bigButton}>
					{this.getCheckBox()}
					<Text style={labelStyle}>{label}</Text>
				</View>
			</TouchableHighlight>
		);
	}
}
