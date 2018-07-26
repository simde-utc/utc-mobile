import React from 'react';
import { View, Image, Text, ScrollView, Button } from 'react-native';
import styles from '../../styles'
import { colors } from '../../styles/variables';
import Storage from '../../services/Storage';

const key = "test storage"

export default class HomeScreen extends React.Component {

	componentWillMount() {
		this.getData()
	}

	getData = async () => {
		Storage.getItem(key)
			.then(data => console.log("Got ", data))
			.catch(err => console.log(err))
	}

	setData = async (i) => {
		let data;
		switch (i) {
			case 1:
				data = "abc"
			case 2:
				data = ["azd", 4, { a: 4 }]
			case 3:
				data = {a: 1, b: 3}
			case 4:
				data = null
			case 5:
				data = undefined
		}

		Storage.setData(key, data)
			.then(() => console.log("Data "+i+" set"))
			.catch(err => console.warn("Error setting data "+i+" : "+err))
	}

	render() {
		return (
			<View style={ styles.container.center }>
				<Text> Home </Text>
				<Button onPress={ this.getData } title="Get item and log" />
				<Button onPress={() => this.setData(1) } title="Set text" />
				<Button onPress={() => this.setData(2) } title="Set array" />
				<Button onPress={() => this.setData(3) } title="Set object" />
				<Button onPress={() => this.setData(4) } title="Set null" />
				<Button onPress={() => this.setData(5) } title="Set undefined" />
			</View>
		);
	}
}
