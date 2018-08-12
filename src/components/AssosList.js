/**
 * Affiche la liste des assos en fonction de données du portail
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../styles'

import List from './List';
import { createMaterialTopTabNavigator } from 'react-navigation';

const listStyle = StyleSheet.create({
	container: {
		justifyContent: 'flex-start',
		paddingHorizontal: 10,
		paddingVertical: 20,
		flex:1
	},
	elementView: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginVertical: 8,
		marginHorizontal: 20,
	},
	iconContainer: {
		marginRight: 15
	},
	text: {
		fontSize: 14,
		justifyContent: 'flex-start'
	},

	arrowStyle: {

	},

	icon: {

	}
});


export default class AssosListComponent extends React.Component {

	constructor(props) {
		super(props);
		listStyle = this.props.style || listStyle;
	}
	
PoleTabs(data) {
	var tabs = {};
	var screensOrder = [];
	//on commence par le root
	//on se sert de l'id pour nommer le screen, c'est donc la clef de l'objet tabs
	tabs[data[0]["id"]] = this.formatPole(data[0]);
	screensOrder.push(data[0]["id"]);
	//ici, la difficulté est de déterminer quelle asso est un pôle. On considère que toute asso qui n'est pas 0 et qui a des enfants est un pôle
	for (let asso of data[0]["children"]) {
	//pour chaque asso sous le bde
		if (asso["children"].length != 0) {
			tabs[asso["id"]] = this.formatPole(asso);
			screensOrder.push(asso["id"]);
		}
	}

	//et finalement les options
	var options = {
		tabBarOptions: {
			style: styles.tabBar.style,
			labelStyle: styles.tabBar.label,
		},
		backBehavior: 'none',
		initialRouteName: 'Members',
		order: screensOrder,
	}

	return createMaterialTopTabNavigator(tabs, screensOrder);
}


formatPole(pole) {
return {
	screen: () =>(this.formatChildren(pole["children"])),
	navigationOptions: ({nav}) => ({
		title: pole["shortname"]
	})
}
}
	
formatChildren(children) {
	var list = [];
	for (let child of children) {
		list.push({icon : 'bell', text : child["shortname"], onPress: () => this.props.navigation.navigate('AssoDetails', {name: child["name"], id: child["id"], portailInstance : this.props.portailInstance})});
	}
return <List data={list} arrow={true} style={listStyle} />;
}
	
	render() {
		if(this.props.data !== undefined) {
			switch(this.props.data) {
				case "WAIT_LOADING" :
					return <Text>Chargement...</Text>;
					break;
				case {}:
				case []:
				case "":
					return <View />
					break;
				default:
					const Tab = this.PoleTabs(this.props.data);
					return (<Tab />);
					break;		
			}
		}
		else {
			return <View />
		}
	}
}
