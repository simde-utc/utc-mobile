import React from 'react';
import Button from 'react-native-button';

import styles from '../styles';

const BigButton = ({ label, onPress, style }) => {
	const btnStyle = [styles.get('bigButton', 'bg.lightBlue', 'text.white'), style];
	return (
		<Button style={btnStyle} onPress={checked => onPress(checked)}>
			{label}
		</Button>
	);
};

export default BigButton;
