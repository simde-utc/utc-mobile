/**
 * Affiche la liste des assos en fonction de données du portail
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { View, Text, Image, Button, ScrollView } from 'react-native';
import Hr from '../../components/Hr';
import {colors} from '../../styles/variables';
import styles from '../../styles'
import { createMaterialTopTabNavigator } from 'react-navigation';
import Markdown from 'react-native-simple-markdown'


const markdownStyles = {
  heading1: {
    fontSize: 24,
    color: colors.gray,
  },
  link: {
    color: colors.yellow,
  },
  mailTo: {
    color: colors.lightBlue,
  },
  text: {
    color: colors.black,
  },
}


export default class AssoScreen extends React.Component {
constructor(props) {
	super(props);
	this._loadDetails();
	this.isUnMounted = false;

}
	state = {
		warn: false,
		message : "",
		description : "",
		type : "",
		parentId : "",
		parentName : "",
	}

warn(text) {
	console.warn(text);
	if (this.isUnmounted) {return;}
	this.setState(prevState => ({ ...prevState, warn: true, message: text}));
}


_loadDetails() {
	if (this.isUnmounted) {return;}
	const { navigation } = this.props;
	const id = navigation.getParam('id', 'NO-ID');
		if(id == "NO-ID") {throw "No asso id provided!";}
	this.portail = navigation.getParam('portailInstance', 'NO-PORTAIL');
		if(this.portail == "NO-PORTAIL") {throw "No portail instance provided!";}
		if(!this.portail.isConnected()) {throw "The provided Portail instance is not connected!";}

	this.portail.getAssoDetails(id).then( (data) => {
		if (this.isUnmounted) {return;}
		if(data["parent"]) {
			this.setState(prevState => ({ ...prevState, description: data["description"], type: data["type"]["name"], parentId: data["parent"]["id"], parentName : data["parent"]["shortname"]}));
		}
		else {
			//root : pas de parent
			this.setState(prevState => ({ ...prevState, description: data["description"], type: data["type"]["name"]}));
		}
	}).catch( ([response, status]) => {
		this.warn("Erreur lors de la connexion au portail : " + response + ' --- ' + status);
	});
}

render() {


var Tab = createMaterialTopTabNavigator(
	{
		Presentation: {
			screen: () => (<PresentationView
					description={this.state.description}
					parentName={this.state.parentName}
					type={this.state.type}
					/>),
			navigationOptions: ({ nav }) => ({
				title: 'En bref'
			})
		},
		Articles: {
			screen: ToDoView,
			navigationOptions: ({ nav }) => ({
				title: 'Articles'
			})
		},
		Events: {
			screen: ToDoView,
			navigationOptions: ({ nav }) => ({
				title: 'Evénements'
			})
		},
		Trombi: {
			screen: ToDoView,
			navigationOptions: ({ nav }) => ({
				title: 'Trombi'
			})
		},

	},
	{
		tabBarOptions: {
			style: styles.assoTabBar.style,
			labelStyle: styles.tabBar.label,

		},
		backBehavior: 'none',
		initialRouteName: 'Presentation',
		order: ['Presentation', 'Articles', 'Events', 'Trombi'],
	});

return <Tab />;

  }

componentWillUnmount() {
if(this.portail !== undefined) {this.portail.abortRequest();}
this.isUnMounted = true;
}
}

class PresentationView extends React.Component {

render() {
	return <ScrollView
		contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: colors.veryLightGray, paddingHorizontal: 30 }}>
			<Image
			source={this.props.logo || require('../../img/payutc.png')}
			resizeMode='contain'
			style={{height:100, margin:20}}
			/>

			<Markdown styles={markdownStyles}>
				{this.props.description}
			</Markdown>

			<Hr style={{backgroundColor: colors.lightGray}}/>

			<Text>{this.props.type}</Text>
			<Text>{this.props.parentName}</Text>

		</ScrollView>;

	}

}

class ToDoView extends React.Component {

render() {
	return <ScrollView
		contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: colors.veryLightGray, paddingHorizontal: 30 }}>
			<Text>//TODO</Text>
		</ScrollView>;

	}

}
