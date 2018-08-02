import React from 'react';
import { View, Image, Text, ScrollView, Button, TextInput } from 'react-native';
import styles from '../styles'
import { colors } from '../styles/variables';
import CASAuth from '../services/CASAuth';

import ActualitesUTC from '../services/ActualitesUTC';

export default class ActualitesUTCTestScreen extends React.Component {
		
	constructor(props) {
		super(props);
		this.cas = new CASAuth();
	}
	state = {
		log: "",
		login: "rmaliach",
		password: "",
		service : "http://actualites.utc.fr/wp-login.php?external=cas&redirect_to=%2Ffeed",
		st : ""
	}
	
	defaultValues = {
		login: "rmaliach",
		service : "http://assos.utc.fr/cas",
	}	

	log = (data, error = false) => {
		this.setState(prevState => ({ ...prevState, log: data }));
		if (error)
			console.warn(data)
		else
			console.log(data);
	
	}

log_in = (login, password) => {
	this.log("logging in...");
	
	
	
	promise = this.cas.login(login, password);
	promise.then(([text, status, url]) => {
				this.log(text +" "+status+" "+url);
				//this.log(this.cas.isConnected() ? "connected" : "not connected");
				
				
	}
	).catch( ([text, status, url]) => {
		this.log(text + " "+status+" "+url, true);
	});
	
}

getArticles() {
let service = this.state.service;
	promise = this.cas.getService(service);
	promise.then(([text, status, url]) => {
				this.st = text;
				
			if(!this.st) {this.log("pas de st!", true); return;}
			this.actus = new ActualitesUTC(this.st);
			this.log("loading articles");
			try {
			this.actus.loadArticles();
			} catch (e) {console.log(e);}
				
				
	}
	).catch( ([text, status, url]) => {
		this.log(text + " "+status, true);
	});

}


	render() {
		return (
			<View style={[ styles.get('container.center', 'container.padded'), { justifyContent: 'space-around', alignItems: 'stretch' } ]}>
				<Text>State : { this.state.log }</Text>
				<TextInput
				  style={{height: 40}}
				  placeholder="login"
				defaultValue = {this.defaultValues.login}
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
				defaultValue = {this.defaultValues.service}
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, service: text }))}
				/>
				<Button onPress={ () => {this.getArticles();}} title="get service & get articles" />
			</View>
		);
	}
}
