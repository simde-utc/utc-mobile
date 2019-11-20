import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles';

const HeaderView = ({ title, subtitle, style, children }) => {
	const titleStyle = [ styles.get('text.yellow', 'text.h2', 'text.center', 'p.sm'), {marginBottom: 50}];
	const subtitleStyle = styles.get('text.white', 'text.h4', 'text.center');
	const viewStyle = [
		styles.get('container.default', 'bg.lightBlue'),
		{
			flex: 4,
			justifyContent: 'center',
			padding: 20,
		},
		style,
	];

	return (
		<View style={viewStyle}>
			{title && <Text style={titleStyle}>{title}</Text>}
			{subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
			{children}
		</View>
	);
};

export default HeaderView;
