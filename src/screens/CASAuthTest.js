import React from 'react';
import { View, Image, Text, ScrollView, Button, TextInput } from 'react-native';
import styles from '../styles'
import { colors } from '../styles/variables';
import CASAuth from '../services/CASAuth';


export default class CASAuthTestScreen extends React.Component {
		
	constructor(props) {
		super(props);
		this.cas = new CASAuth();
	}
	state = {
		log: "",
		login: "",
		password: "",
		service : ""
	}

	log = (data, error = false) => {
		this.setState(prevState => ({ ...prevState, log: data }));
		if (error)
			console.warn(data)
		else
			console.log(data);
	
	}

log_in = (login, password) => {
	console.log("login : "+login+", password : "+password);
	
	
	
	promise = this.cas.login(login, password);
	promise.then(([text, status, url]) => {
				this.log(text +" "+status+" "+url);
				//this.log(this.cas.isConnected() ? "connected" : "not connected");
				
				
	}
	).catch( ([text, status, url]) => {
		this.log(text + " "+status+" "+url, true);
	});
	
}

get_service(service) {
	promise = this.cas.getService(service);
	promise.then(([text, status, url]) => {
				this.log(text +" "+status+" "+url);
				//this.log(this.cas.isConnected() ? "connected" : "not connected");
				
				
	}
	).catch( ([text, status, url]) => {
		this.log(text + " "+status+" "+url, true);
	});

}

	render() {
		return (
			<View style={[ styles.get('container.center', 'container.padded'), { justifyContent: 'space-around', alignItems: 'stretch' } ]}>
				<Text>State : { this.state.log }</Text>
				<TextInput
				  style={{height: 40}}
				  placeholder="login"
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, login: text }))}
				/>
				<TextInput
				  style={{height: 40}}
				  placeholder="password"
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, password: text }))}
				/>
				<Button onPress={ () => {this.log_in(this.state.login, this.state.password); } } title="Log in" />
				<TextInput
				  style={{height: 40}}
				  placeholder="service"
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, service: text }))}
				/>
				<Button onPress={ () => {this.get_service(this.state.service); } } title="get service" />
			</View>
		);
	}
}
