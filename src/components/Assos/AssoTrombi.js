/**
 * Affiche la liste des membres d'une asso en fonction de données du portail
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
 * */

import React from 'react';
import { View, Text } from 'react-native';
import Handler from '../Block';

import defaultAvatar from '../../img/bde.png';

export default class AssoTrombiComponent extends React.PureComponent {
	PeopleBlocks(data = []) {
		const { navigation } = this.props;
		const blocks = [];

		if (data && data[0]) {
			// c'est dégueu mais au moins la structure de données est ok
			try {
				data.forEach(person => {
					blocks.push(this.formatPerson(person));
				});
			} catch (e) {
				console.warn(e);
			}
		}

		if (blocks !== undefined) {
			return (
				<Handler
					blocks={blocks}
					editMode={false}
					deleteMode={false}
					addTools={false}
					navigation={navigation}
				/>
			);
		}
		return <Text>No data</Text>;
	}

	formatPerson(person) {
		const { rolesData } = this.props;
		const image = person.image ? { uri: person.image } : defaultAvatar;

		return {
			text: `${person.name} - ${rolesData.get(person.pivot.role_id).name}`,
			image,
			extend: false,
		};
	}

	render() {
		const { trombiData } = this.props;

		if (trombiData !== undefined) {
			switch (trombiData) {
				case {}:
				case []:
				case '':
					return <View />;
				default:
					return this.PeopleBlocks(trombiData);
			}
		} else {
			return <View />;
		}
	}
}
