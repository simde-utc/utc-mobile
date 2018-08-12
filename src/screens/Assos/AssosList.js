import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import styles from '../../styles/';
import AssoDetailsScreen from './AssoDetails';

import Portail from '../../services/Portail';

import AssosListComponent from '../../components/AssosList';


class AssosListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.assos = {};
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
		if(this.isUnMounted) {return;}
		await Portail.login("romain@maliach.fr", "Patate123");
		if(!Portail.isConnected()) {this.log("Erreur de connexion au portail!", true);return;}
		if(this.isUnMounted) {return;}
		this.assos = await Portail.getAssos(true, 0, 2);
		if(this.isUnMounted) {return;}
		this.setState(prevState => ({ ...prevState, list: this.assos }));
		
	}
	catch ([response, status]) {
		this.log(response + ' --- ' + status, true);
	}
	}


	


	render() {

	    return (
	      <View style={{ flex: 1 }}>
		<AssosListComponent data={this.state.list} portailInstance={Portail} navigation={this.props.navigation}/>
	      </View>
	    );
	  }

componentWillUnmount() {
if(Portail !== undefined) {Portail.abortRequest();}
this.isUnMounted = true;
}

}


export default AssosExploreLayout = createStackNavigator(
{
	AssosList: {
		screen: AssosListScreen,
		navigationOptions: ({ navigation }) => ({
			title: 'Associations',
		}),
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
