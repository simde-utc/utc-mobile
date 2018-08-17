/**
 * Affiche la liste des assos en fonction de données du portail
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../../styles'
import { colors } from '../../styles/variables';

import { withNavigation } from 'react-navigation';

import BlockHandler from '../Block';

class AssosListComponent extends React.Component {

	constructor(props) {
		super(props);
	}

AssosBlocks(data, isChild) {
	var blocks = [];

	if(isChild == false) {
		//root et pôles
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
		if(data["children"][0]["children"].length != 0) {
			//si on veut lister les assos sous le bde
			for (let child of data["children"]) {
				//ne mettre que les assos, pas les pôles
				if(child["children"].length == 0) {
					blocks.push(this.formatChild(child));
				}
			}
		}
		else {
		//sinon, pas de problème, toute asso sous un vrai pôle n'est pas un pôle
			for (let child of data["children"]) {
				blocks.push(this.formatChild(child));
			}
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
		text: pole["shortname"],
	        extend: false,
		onPress: () => {
			this.props.navigation.push('Assos', {name: pole["name"], id: pole["id"], isChild : true, data: pole, portailInstance : this.props.portailInstance, title: child["shortname"]});
		},
		image: require('../../img/logo_utc.png'),
	}
}

formatChild(child) {
return {
		text: child["shortname"],
	        extend: false,
		onPress: () => {
			this.props.navigation.navigate('Asso', {name: child["name"], id: child["id"], portailInstance : this.props.portailInstance});
		},
		image: require('../../img/logo_utc.png'),
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
