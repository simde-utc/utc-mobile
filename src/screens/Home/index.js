import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';
import styles from '../../styles'
import { colors } from '../../styles/variables';

export default class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Accueil',
	};

	render() {
		return (
			<Text> Home </Text>
		);
	}
}
