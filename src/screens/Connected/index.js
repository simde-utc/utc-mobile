import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';
import Button from 'react-native-button';
import { resetNavigation } from '../../utils/navigation'
import styles from '../../styles'
import { colors } from '../../styles/variables';

export default class ConnectedScreen extends React.Component {
	static navigationOptions = {
		title: 'Connected',
		headerStyle: {
			display: 'none',
		}
	};

	render() {
		return (
			<View>
				<Text> Connecté en tant que... </Text>
				<Button onPress={ () => resetNavigation(this.props.navigation) }>
					Aller à la page d'accueil
				</Button>
			</View>
		);
	}
}
