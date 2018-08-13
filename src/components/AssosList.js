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
import { colors } from '../styles/variables';

import { withNavigation } from 'react-navigation';

import BlockHandler from '../components/Block';

class AssosListComponent extends React.Component {

	constructor(props) {
		super(props);
	}
	
AssosBlocks(data, isChild) {
	var blocks = [];

	if(isChild == false) {
		//on commence par le root
		blocks.push(this.formatPole(data[0]));
		//ici, la difficulté est de déterminer quelle asso est un pôle. On considère que toute asso qui n'est pas 0 et qui a des enfants est un pôle
		for (let asso of data[0]["children"]) {
		//pour chaque asso sous le bde, on l'ajoute si c'est un pôle
			if (asso["children"].length != 0) {
				blocks.push(this.formatPole(asso));
			}
		}
	}
	else {
		//pour le moment, on rajoute le pôle avec ses propres enfants
		blocks.push(this.formatChild(data));
		for (let child of data["children"]) {
			blocks.push(this.formatChild(child));
		}
	}

	return (
		<BlockHandler
			blocks={ blocks }
			editMode={ false }
			deleteMode={ false }
			addTools = {false}
			navigation = {this.props.navigation}
		/>
	); 
}

//TODO: des images pour les pôles et les assos
formatPole(pole) {
return {
		children: (<Text>{pole["shortname"]}</Text>),
	        extend: true,
		onPress: () => {
			this.props.navigation.push('AssosList', {name: pole["name"], id: pole["id"], isChild : true, data: pole, portailInstance : this.props.portailInstance});
		},
		image: require('../img/logo_utc.png'),
	}
}
	
formatChild(child) {
return {
		children: (<Text>{child["shortname"]}</Text>),
	        extend: true,
		onPress: () => {
			this.props.navigation.navigate('AssoDetails', {name: child["name"], id: child["id"], portailInstance : this.props.portailInstance});
		},
		image: require('../img/logo_utc.png'),
	}
}
	
	render() {
		if(this.props.data !== undefined && this.props.isChild !== undefined) {
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
					return this.AssosBlocks(this.props.data, this.props.isChild);
					break;		
			}
		}
		else {
			return <View />
		}
	}
}

export default withNavigation(AssosListComponent);
