import React from 'react';
import { View, Image, Text, ScrollView, Button } from 'react-native';
import styles from '../../styles'
import { colors } from '../../styles/variables';
import Storage from '../../services/Storage';

const key = "test storage"


export default class HomeScreen extends React.Component {

	getter = async () => {
		console.log("Getter started")
		Storage.getItem(key)
			.then(data => console.log("Got ", data))
			.catch(err => console.log(err))
	}

	setter = async (i) => {
		console.log("Setter "+i+" started")
		let data;
		switch (i) {
			case 1:
				data = "abc";
				break;
			case 2:
				data = ["azd", 4, 4.5];
				break;
			case 3:
				data = {a: 1, b: 3};
				break;
			case 4:
				data = null;
				break;
			case 5:
				data = undefined;
				break;
		}
		console.log("Data to set :", data)

		Storage.setItem(key, data)
			.then(() => console.log("Data "+i+" set"))
			.catch(err => console.warn("Error setting data "+i+" : "+err))
	}

	render() {
		return (
			<View style={ styles.container.center }>
				<Text> Home </Text>
				<Button onPress={ this.getter } title="Get item and log" />
				<Button onPress={() => this.setter(1) } title="Set text" />
				<Button onPress={() => this.setter(2) } title="Set array" />
				<Button onPress={() => this.setter(3) } title="Set object" />
				<Button onPress={() => this.setter(4) } title="Set null" />
				<Button onPress={() => this.setter(5) } title="Set undefined" />
			</View>
		);
	}
}
