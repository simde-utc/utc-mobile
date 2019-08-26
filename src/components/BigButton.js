import React from 'react';
import { TouchableHighlight, Text } from 'react-native';

import styles from '../styles';

const BigButton = ({ label, onPress, style }) => {
	const btnStyle = [styles.get('bigButton', 'bg.lightBlue'), style];

	return (
		<TouchableHighlight style={btnStyle} onPress={checked => onPress(checked)}>
			<Text style={[styles.get('text.white', 'text.h4'), { width: '100%', textAlign: 'center' }]}>
				{label}
			</Text>
		</TouchableHighlight>
	);
};

export default BigButton;
