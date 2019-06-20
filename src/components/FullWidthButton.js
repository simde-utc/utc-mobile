import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import styles from '../styles';

const buttonStyles = styles.navigation.fullWidthButton;

const FullWidthButton = ({ onPress, name }) => (
	<TouchableHighlight
		style={buttonStyles.touchable}
		onPress={onPress}
		underlayColor="#007383"
		activeOpacity={0.7}
	>
		<View style={buttonStyles.view}>
			<View style={buttonStyles.textView}>
				<Text style={buttonStyles.text}>{name}</Text>
			</View>
			<View>
				<FontAwesomeIcon icon={['fas', 'arrow-right']} size={22} style={styles.text.yellow} />
			</View>
		</View>
	</TouchableHighlight>
);

export default FullWidthButton;
