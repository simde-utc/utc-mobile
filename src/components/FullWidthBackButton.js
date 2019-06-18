import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import Icon from './Icon';
import styles from '../styles';
import yellowArrowIcon from '../img/icons/arrow_yellow_back.png';

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
				<Icon image={yellowArrowIcon} />
			</View>
			<View style={buttonStyles.textBackView}>
				<Text style={buttonStyles.textBack}>{name || 'Retour'}</Text>
			</View>
		</View>
	</TouchableHighlight>
);

export default FullWidthBackButton;
