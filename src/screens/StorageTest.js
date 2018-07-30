import React from 'react';
import { View, Image, Text, ScrollView, Button } from 'react-native';
import BigCheckBox from '../components/BigCheckBox';
import styles from '../styles'
import { colors } from '../styles/variables';
import Storage from '../services/Storage';

const key = "test.storage"

export default class StorageTestScreen extends React.Component {
	state = {
		security: false,
		log: ""
	}

	// ========== Helpers ==========

	toggleSecurity = (checked) => {
		console.log("Security :", checked ? "ON" : "OFF")
		this.setState(prevState => ({ ...prevState, security: checked }))
		return checked;
	}

	log = (data, error = false) => {
		this.setState(prevState => ({ ...prevState, log: data }));
		if (error)
			console.warn(data)
		else
			console.log(data);
	}

	// ========== Getter & Setters ==========

	getter = async () => {
		console.log("Getter started", this.state.security ? "SECURE" : "NOT SECURE")
		
		let promise = this.state.security ? Storage.getSensitiveData(key) : Storage.getItem(key)
		promise.then(data => this.log(data))
			.catch(err => this.log(err, true))
	}

	setter = async (i) => {
		console.log("Setter "+i+" started", this.state.security ? "SECURE" : "NOT SECURE")
		let data;
		switch (i) {
			case 1:
				data = "abc";
				break;
			case 2:
				data = 3.2575;
				break;
			case 3:
				data = ["azd", 4, 4.5];
				break;
			case 4:
				data = {a: 1, b: 3};
				break;
			case 5:
				data = null;
				break;
		}

		let promise = this.state.security ? Storage.setSensitiveData(key, data) : Storage.setItem(key, data)
		promise.then(() => console.log("Data "+i+" set"))
			.catch(err => console.warn("Error setting data "+i+" : "+err))
	}

	render() {
		return (
			<View style={[ styles.get('container.center', 'container.padded'), { justifyContent: 'space-around', alignItems: 'stretch' } ]}>
				<BigCheckBox value={ this.state.security } onChange={ this.toggleSecurity } label="Encrypted data" />
				<Text>Got : { JSON.stringify(this.state.log, null, 2) }</Text>
				<Button onPress={ this.getter } title="Get item and log" />
				<Button onPress={() => this.setter(1) } title="Set text" />
				<Button onPress={() => this.setter(2) } title="Set number" />
				<Button onPress={() => this.setter(3) } title="Set array" />
				<Button onPress={() => this.setter(4) } title="Set object" />
				<Button onPress={() => this.setter(5) } title="Set null" />
			</View>
		);
	}
}
