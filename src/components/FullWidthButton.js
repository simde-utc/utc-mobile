import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import Icon from './Icon';
import styles from '../styles';
import yellowArrowIcon from '../img/icons/arrow_yellow.png';

const FullWidthButton = ({ onPress, name }) => (
	<TouchableHighlight
		style={{ marginBottom: 10 }}
		onPress={onPress}
		underlayColor="#007383"
		activeOpacity={0.7}
	>
		<View
			style={{
				padding: 10,
				backgroundColor: '#fff',
				flex: 1,
				flexDirection: 'row',
				alignItems: 'center',
			}}
		>
			<View
				style={{
					backgroundColor: '#fff',
					borderLeftWidth: 2,
					borderLeftColor: '#fff',
					flex: 1,
				}}
			>
				<Text style={styles.navigation.fullWidthButton.text}>{name}</Text>
			</View>
			<View>
				<Icon image={yellowArrowIcon} />
			</View>
		</View>
	</TouchableHighlight>
);

export default FullWidthButton;
