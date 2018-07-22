import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Button from 'react-native-button';
import styles from '../../styles'
import { colors } from '../../styles/variables';

const resetAction = StackActions.reset({
	index: 0,
	actions: [NavigationActions.navigate({ routeName: "Home" })],
});

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
				<Button onPress={ (checked) => this.props.navigation.dispatch(resetAction) }>
					Aller à la page d'accueil
				</Button>
			</View>
		);
	}
}
