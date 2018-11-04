/**
 * Affiche la liste des membres d'une asso en fonction de données du portail
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

import defaultAvatar from '../../img/bde.png'

export default class AssoTrombiComponent extends React.PureComponent {

	constructor(props) {
		super(props);
		
	}


PeopleBlocks(data = [] ) {

if(data && data[0]) { //c'est dégueu mais au moins la structure de données est ok
var blocks = [];
try {
	data.forEach( (person) => {
			blocks.push(this.formatPerson(person));
	});
}
catch (e) {console.warn(e);}

}

if (blocks !== undefined) {
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
else{ return(<Text>No data</Text>);}

}

formatPerson(person) {
let image = person["image"] ? {uri: person["image"]} : defaultAvatar;
return {
		text: person["name"] + " - " + this.props.rolesData.get(person["pivot"]["role_id"]).name,
		image: image,
    extend: false,
	}
}

	render() {

		if(this.props.trombiData !== undefined) {
			switch(this.props.trombiData) {
				case {}:
				case []:
				case "":
					return <View />
					break;
				default:
					return this.PeopleBlocks(this.props.trombiData);
					break;
			}
		}
		else {
			return <View />
		}
}
}
