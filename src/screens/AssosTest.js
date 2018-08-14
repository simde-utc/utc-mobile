import React from 'react';
import { View, Image, Text, ScrollView, Button, TextInput, Picker } from 'react-native';
import styles from '../styles'
import { colors } from '../styles/variables';

import Portail from '../services/Portail';
import CheckBox from 'react-native-checkbox-svg';

export default class AssosTestScreen extends React.Component {
		
	constructor(props) {
		super(props);
	}
	state = {
		log: "",
		login: "romain@maliach.fr",
		password: "Patate123",
		tree : false,
		downfloor : "",
		upflorr : "",
		assoid : ""
	}
	
	defaultValues = {
		login: "romain@maliach.fr",
		password : "Patate123"
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
	Portail.login(login, password).then( () => {this.log("logged in.");}).catch ( ([response, status]) => {this.log(response + ' --- ' + status, true);});
	
}

get_assos = (tree, stageDown, stageUp) => {
	if(!Portail.isConnected()) {this.log('Not connected', true); return;}
	//les undefined ou strings vides sont gérés par portail
	Portail.getAssos(id, tree, stageDown, stageUp).then( (data) => {
		this.log('got data -> console'); console.log(data);
	}).catch( ([response, status]) => {
		this.log(response + ' --- ' + status, true);
	});
}

get_asso_details = (id) => {
	if(!Portail.isConnected()) {this.log('Not connected', true); return;}
	//les undefined ou strings vides sont gérés par portail
	Portail.getAssoDetails(id).then( (data) => {
		this.log('got data -> console'); console.log(data);
	}).catch( ([response, status]) => {
		this.log(response + ' --- ' + status, true);
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
				  defaultValue = {this.defaultValues.password}
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, password: text }))}
				/>
				<Button onPress={ () => {this.log_in(this.state.login, this.state.password); } } title="Log in" />
				<CheckBox 
					checked={ this.state.tree }
					labelStyle={ styles.text.h5 }
					label={"Tree ?"}
					onChange={(checked) => this.setState(prevState => ({ ...prevState, tree: !prevState.tree }))}
				/>
				<TextInput
				  style={{height: 40}}
				  placeholder="down floor"
				  keyboardType='numeric'
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, downfloor: text }))}
				/>
				<TextInput
				  style={{height: 40}}
				  placeholder="up floor"
				  keyboardType='numeric'
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, upfloor: text }))}
				/>
				<Button onPress={ () => {this.get_assos(this.state.tree, this.state.downfloor, this.state.upfloor); } } title="get assos" />
				<TextInput
				  style={{height: 40}}
				  placeholder="asso id"
				  keyboardType='numeric'
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, assoid: text }))}
				/>
				<Button onPress={ () => {this.get_asso_details(this.state.assoid); } } title="get asso details" />
			</View>
		);
	}
}
