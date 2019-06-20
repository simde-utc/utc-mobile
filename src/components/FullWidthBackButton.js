import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import styles from '../styles';
import { _ } from '../utils/i18n';

const buttonStyles = styles.navigation.fullWidthButton;

const FullWidthBackButton = ({ onPress, name }) => (
	<TouchableHighlight
		style={buttonStyles.touchable}
		onPress={onPress}
		underlayColor="#007383"
		activeOpacity={0.7}
	>
		<View style={buttonStyles.backView}>
			<View style={buttonStyles.icon}>
				<FontAwesomeIcon icon={['fas', 'arrow-left']} size={22} style={styles.text.red} />
			</View>
			<View style={buttonStyles.textBackView}>
				<Text style={buttonStyles.textBack}>{name || _('back')}</Text>
			</View>
		</View>
	</TouchableHighlight>
);

export default FullWidthBackButton;
