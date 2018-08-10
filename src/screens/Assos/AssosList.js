import React from 'react';
import { View, Text, Image, Button } from 'react-native';
import { createStackNavigator  } from 'react-navigation';
import styles from '../../styles/';
import AssoDetailsScreen from './AssoDetails';

import Portail from '../../services/Portail';

import List from '../../components/List';

class AssosListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.assos = {};
		this._loadAssos();
	}

	state = {
		log: "",
		assosList: [	{ icon: 'news',	text: "chargement" }],
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
		this.assos = await Portail.getAssos();
		var list = [];
		for (let asso of this.assos) {
			list.push({icon : 'bell', text : asso["shortname"], onPress: () => this.props.navigation.navigate('AssoDetails', {name: asso["name"], id: asso["id"], portailInstance : Portail})});
		}
		if(this.isUnMounted) {return;}
		this.setState(prevState => ({ ...prevState, assosList: list }));
	}
	catch ([response, status]) {
		this.log(response + ' --- ' + status, true);
	}
	}

	render() {

	    return (
	      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
		<Text>Assos</Text>
		<Text>State : {this.state.log}</Text>
		<List data={this.state.assosList} />
	
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
