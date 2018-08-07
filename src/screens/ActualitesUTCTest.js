import React from 'react';
import { View, Image, Text, ScrollView, Button, TextInput, Picker } from 'react-native';
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
		service : "http://actualites.utc.fr/wp-login.php?external=cas&redirect_to=%2Fwp-json%2Fwp%2Fv2%2Fposts",
		date : "Jul 17, 2018 03:24:00",
		st : "",
		order: "",
		page : "1",
		pagination : "3",
		wpArtId : "18186",
	}
	
	defaultValues = {
		login: "rmaliach",
		service : "http://actualites.utc.fr/wp-login.php?external=cas&redirect_to=%2Fwp-json%2Fwp%2Fv2%2Fposts",
		date: "Jul 17, 2018 03:24:00",
		page : "1",
		pagination : "3",
		wpArtId : "18186"
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
	this.cas.login(login, password).then(([text, status, url]) => {
		this.log(this.cas.isConnected() ? "connected" : "not connected");
	}
	).catch( ([text, status, url]) => {
		this.log(text + " "+status+" "+url, true);
	});
	
}

loadArticles() {
let service = this.state.service;
	promise = this.cas.getService(service);
	promise.then(([text, status, url]) => {
				this.st = text;
				
			if(!this.st) {this.log("pas de st!", true); return;}
			this.actus = new ActualitesUTC(this.st);
			this.log("loading articles");
			try {	
				this.actus.loadArticles().then( () => {
				 	this.log("articles loaded.");
				});
			} catch (e) {console.log(e);}
				
				
	}
	).catch( ([text, status, url]) => {
		this.log(text + " "+status, true);
	});

}

getArticles() {
	if(this.actus === undefined || !this.actus.articlesWereLoaded()) {this.log("No articles were loaded.");return;}
	this.log("getting articles -> console");
	console.log("!!!!=======!!!!");
	let date = new Date(this.state.date);
	this.actus.getArticles(this.state.pagination,this.state.page,this.state.order, date).forEach( (article) => {console.log(article.title);});
}

getArticleById() {
	if(this.actus === undefined || !this.actus.articlesWereLoaded()) {this.log("No articles were loaded.");return;}
	this.log("getting article -> console");
	console.log("!!!!=======!!!!");
	let id = parseInt(this.state.wpArtId);
	console.log(this.actus.getArticleByWordpressId(id));
}

getRandomArticleId() {
	if(this.actus === undefined || !this.actus.articlesWereLoaded()) {this.log("No articles were loaded.");return;}
	this.log(this.actus.getRandomArticleId());
}


	render() {
		return (
			<ScrollView contentContainerStyle={[ styles.get('container.center', 'container.padded'), { justifyContent: 'space-around', alignItems: 'stretch' } ]}>
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
				<Button onPress={ () => {this.loadArticles();}} title="get service & load articles" />
				<TextInput
				  style={{height: 40}}
				  placeholder="date"
				  defaultValue = {this.defaultValues.date}
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, date: text }))}
				/>
				<TextInput
				  style={{height: 40}}
				  placeholder="pagination"
				  keyboardType="numeric"
				  defaultValue = {this.defaultValues.pagination}
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, pagination: text }))}
				/>
				<TextInput
				  style={{height: 40}}
				  placeholder="page"
				  keyboardType="numeric"
				  defaultValue = {this.defaultValues.page}
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, page: text }))} />
				<Picker
				  selectedValue={this.state.order}
				  style={{ height: 50, width: 100 }}
				  onValueChange={(itemValue, itemIndex) => this.setState(prevState => ({ ...prevState, order: itemValue }))}>
				  <Picker.Item label="Latest" value="latest" />
				  <Picker.Item label="Oldest" value="oldest" />
				  <Picker.Item label="Random" value="random" />
				</Picker>
				<Button onPress={ () => {this.getArticles();}} title="get articles" />
				<TextInput
				  style={{height: 40}}
				  placeholder="wp article id"
				  keyboardType="numeric"
				  defaultValue = {this.defaultValues.wpArtId}
				onChangeText={(text) => this.setState(prevState => ({ ...prevState, wpArtId: text }))} />
				<Button onPress={ () => {this.getArticleById();}} title="get article by id" />
				<Button onPress={ () => {this.getRandomArticleId();}} title="get random article id" />
			</ScrollView>
		);
	}
}
