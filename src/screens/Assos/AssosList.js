/**
 * Affiche la liste des assos en fonction de données du portail
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { createStackNavigator, withNavigation } from 'react-navigation';
import styles from '../../styles/';
import { colors } from '../../styles/variables';
import AssoDetailsScreen from './AssoDetails';

import Portail from '../../services/Portail';

import AssosListComponent from '../../components/Assos/AssosList';


class AssosListScreen extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
	//ce qui se passe ici est très très sale Samy
	var name = navigation.getParam('name', 'Associations');
	var foreColor = colors.white;
	var color = '';
	switch (name) {
		case 'Bureau des Etudiants':
			color = colors.bdeBack;
			break;
		case 'Pôle Artistique et Évènementiel':
		case 'Pôle Artistique et Événementiel':
			//si on faisait du REST j'aurais pas besoin de tenir compte des fautes de frappe du seed Samy
			color = colors.paeBack;
			break;
		case 'Pôle Solidarité Et Citoyenneté':
			color = colors.psecBack;
			break;
		case 'Pôle Technologie et Entreprenariat':
			color = colors.pteBack;
			break;
		case 'Pôle Vie de Campus':
			color = colors.pvdcBack;
			break;
		case 'Associations':
		default:
			color = colors.white;
			foreColor = colors.gray;
			break;
	}
    return {
	title: name,
	headerTintColor: foreColor,
	headerStyle: {
		backgroundColor: color,
	},
    };
  };


	constructor(props) {
		super(props);
		this.assos = {};
		this.portailInstance = this.props.navigation.getParam('portailInstance', 'NO-PORTAIL');
	}


	componentDidMount() {
		this._loadAssos();
	}

	state = {
		log: "",
		list: "WAIT_LOADING",
	}

	log = (data, error = false) => {
		if(this.isUnMounted) {return;}
		this.setState(prevState => ({ ...prevState, log: data }));
		if (error)
			console.warn(data)
		else
			console.log(data);
	}


	_loadAssos = async function() {
	try {

		

		var iAmChild = this.props.navigation.getParam('isChild', 'NO-CHILD');
		if(iAmChild !== true) {iAmChild = false;}
		if(iAmChild == true) {
			var data = this.props.navigation.getParam('data', 'NO-DATA');
			if(data == "NO-DATA") {throw "Requested child asso display, but didn't provide asso data via navigation."}
			this.assos = data;
		}
		else {

			if(this.isUnMounted) {return;}
			if(!Portail.isConnected()) {this.log("Erreur de connexion au portail!", true);return;}

			if(this.isUnMounted) {return;}
			this.assos = await Portail.getAssos(true, 0, 2);

		}

		if(this.isUnMounted) {return;}
		this.setState(prevState => ({ ...prevState, list: this.assos, child: iAmChild }));
		
	}
	catch (e) {
		this.log(e, true);
	}
	}


	


	render() {
	    return (
	      <View style={{ flex: 1 }}>
		<AssosListComponent data={this.state.list} isChild={this.state.child} portailInstance={(this.portailInstance != 'NO-PORTAIL' && this.portailInstance.isConnected()) ? this.portailInstance : Portail} />
	      </View>
	    );
	  }

componentWillUnmount() {
if(Portail !== undefined) {Portail.abortRequest();}
this.isUnMounted = true;
}

}


export default Assos = createStackNavigator(
{
	AssosList: {
		screen: AssosListScreen,
	},
	AssoDetails: {
		screen: AssoDetailsScreen,
		navigationOptions: ({ navigation }) => ({
			title: navigation.state.params.name,
		}),
	}
},
{
	initialRouteName: 'AssosList',
});
