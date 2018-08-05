import React from 'react';
import { View, Image, Text, ScrollView, Button, TextInput } from 'react-native';
import styles from '../styles'
import { colors } from '../styles/variables';

import Portail from '../services/Portail';

export default class ActualitesUTCTestScreen extends React.Component {
		
	constructor(props) {
		super(props);
		//DEBUG
		process.env.PORTAIL_CLIENT_ID='2';
		process.env.PORTAIL_CLIENT_SECRET='E1E5bTVnxSAE5T5K6cnTCCQeHMde1bFMGXNH0a6S';
	}
	state = {
		log: "",
		login: "romain@maliach.fr",
		password: ""
	}
	
	defaultValues = {
		login: "romain@maliach.fr",
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
	Portail.login(this.state.login, this.state.password).then(() => {
		this.log(Portail.isConnected() ? "logged in" : "not logged in");
	}).catch( (e) => {console.log(e); this.log(JSON.stringify(e), true); } );
	
	
}

getArticles() {
	this.log("getting articles...");
	if(!Portail.isConnected()) {this.log("not connected!"); return;}
	
	Portail.getArticles().then(() => {console.log("Portail.articles:");console.log(Portail.articles);}).catch( ([response, status]) => {this.log(response + '---' + status, true);});
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
				
				<Button onPress={ () => {this.getArticles();}} title="get articles" />
			</View>
		);
	}
}
