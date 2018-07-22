import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';
import styles from '../../styles'
import { colors } from '../../styles/variables';

export default class ConnectionScreen extends React.Component {
	static navigationOptions = {
		title: 'Connexion',
		headerStyle: {
			display: 'none',
		}
	};

	render() {
		return (
			<Text> Connexion </Text>
		);
	}
}
