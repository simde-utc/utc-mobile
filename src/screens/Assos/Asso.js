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
import AssoTrombiComponent from '../../components/Assos/AssoTrombi';

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
	listItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
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
		trombiData: [],
		rolesData: new Map(),
	}
	
	warn(text) {
		console.warn(text);
		if (this.isUnmounted) {return;}
		this.setState(prevState => ({ ...prevState, warn: true, message: text}));
	}
	
	
	_loadDetails() {
		if (this.isUnmounted) {return;}
		const { navigation } = this.props;
		this.id = navigation.getParam('id', 'NO-ID');
		if(this.id == "NO-ID") {throw "No asso id provided!";}
		this.portail = navigation.getParam('portailInstance', 'NO-PORTAIL');
		if(this.portail == "NO-PORTAIL") {throw "No portail instance provided!";}
		this.portail.getAssoDetails(this.id).then((data) => {
			if (this.isUnmounted) {return;}
			if(data["parent"]) {
				this.setState(prevState => ({ ...prevState,
					description: data["description"],
					logo: data["image"],
					type: data["type"]["name"],
					parentId: data["parent"]["id"],
					parentName : data["parent"]["shortname"]
				}));
			}
			else {
				//root : pas de parent
				this.setState(prevState => ({ ...prevState,
					description: data["description"],
					logo: data["image"],
					type: data["type"]["name"]
				}));
			}
		}).catch( ([response, status]) => {
			this.warn("Erreur lors de la connexion au portail : " + response + ' --- ' + status);
		});
		this.portail.getAssoMembers(this.id).then( (trombiData) => {
			if (this.isUnmounted) {return;}
			this._loadRoles(trombiData).then( (roles) => {
				this.setState(prevState => ({ ...prevState,
					trombiData: trombiData,
					rolesData: roles
				}));
			});
					
		})
	}
				
	_loadRoles = async (trombiData) => {
		if(trombiData && trombiData[0]) { //c'est dégueu mais au moins la structure de données est ok
			var roles = new Map();
			var promises = [];
			try {
				trombiData.forEach( (person) => {
					promises.push(new Promise( (resolve, reject) => {
						this.portail.getAssoRole(this.id, person["pivot"]["role_id"]).then( (data) => {
							roles.set(person["pivot"]["role_id"], data);
							resolve(true);
						});
					}));
				});
			}
			catch (e) {console.warn(e);}
			
		}
				
		if(promises) {
			return Promise.all(promises).then( () => {
				return roles;
			})
		}
		else {return this.state.rolesData;}
				
	}
			
	render() {

		var Tab = createMaterialTopTabNavigator(
			{
				Presentation: {
					screen: () => (
						<PresentationView
							description={this.state.description}
							parentName={this.state.parentName}
							type={this.state.type}
							logo={this.state.logo}
						/>
					),
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
					screen: () => (<AssoTrombiComponent trombiData={this.state.trombiData} rolesData={this.state.rolesData} />),
					navigationOptions: ({ nav }) => ({
						title: 'Trombi'
					})
				},
					
			},
			{
				tabBarOptions: {
					style: styles.assoTabBar.style,
					labelStyle: styles.assoTabBar.label,
					
				},
				backBehavior: 'none',
				initialRouteName: 'Presentation',
				order: ['Presentation', 'Articles', 'Events', 'Trombi'],
			}
		);
		
		return <Tab />;			
	}
					
	componentWillUnmount() {
		if(this.portail !== undefined) {this.portail.abortRequest();}
		this.isUnMounted = true;
	}
}
				
class PresentationView extends React.Component {
	
	render() {
		return <View style={{ flex:1, backgroundColor: colors.veryLightGray}}>
		<ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', backgroundColor: colors.veryLightGray, paddingHorizontal: 30}}>
		{this.props.logo &&
			<View style={{height:100, width: '100%'}}>
			<Image
			source={{uri: this.props.logo}}
			resizeMode='contain'
			style={{height:100, margin:20}}
			/>
			</View>
		}
		<View style={{marginTop: 40}}>
		<Markdown styles={markdownStyles}>
		{this.props.description}
		</Markdown>
		</View>
		
		<Hr style={{backgroundColor: colors.lightGray}}/>
		
		<Text>{this.props.type}</Text>
		<Text>{this.props.parentName}</Text>
		
		</ScrollView>
		</View>;
		
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