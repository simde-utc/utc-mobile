/**
 * Affiche la liste des assos en fonction de données du portail
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
 * */

import React from 'react';
import { View, Text } from 'react-native';

import { withNavigation } from 'react-navigation';

import Handler from '../Block';
import logoBde from '../../img/bde.png';

class AssosListComponent extends React.Component {
	AssosBlocks(data, isChild, showItself = false) {
		const { navigation } = this.props;
		const blocks = [];

		if (!Array.isArray(data)) data = [data];

		if (!isChild) {
			// Affichage du niveau zéro et des pôles
			for (const child of data) {
				if (child.children.length !== 0) {
					blocks.push(this.formatPole(child, true)); // On suppose que cette asso est le BDE
					for (const asso of child.children) {
						// Affichage des pôles
						if (asso.children.length !== 0) blocks.push(this.formatPole(asso));
					}
				} // Cas normalement impossible (asso orpheline)
				else blocks.push(this.formatChild(child));
			}
		} else if (showItself) {
			// Affichages des assos du BDE (Y compris le BDE)
			for (const child of data) {
				blocks.push(this.formatChild(child));
				if (child.children.length !== 0) {
					for (const asso of child.children) {
						// Affichage des assos
						blocks.push(this.formatChild(asso));
					}
				} // Cas normalement impossible (asso orpheline)
				else blocks.push(this.formatChild(child));
			}
		} else {
			// Affichage des assos d'un pôle
			for (const child of data) {
				if (child.children.length !== 0) {
					for (const asso of child.children) {
						// Affichage des assos
						if (asso.children.length !== 0) blocks.push(this.formatPole(asso));
						else blocks.push(this.formatChild(asso));
					}
				} // Cas normalement impossible (asso orpheline)
				else blocks.push(this.formatChild(child));
			}
		}
		/*
		if(isChild == false) {
			//root et pôles
			blocks.push(this.formatPole(data[0]));
			//ici, la difficulté est de déterminer quelle asso est un pôle. On considère que toute asso qui n'est pas 0 et qui a des enfants est un pôle
			for (let asso of data[0]["children"]) {
			//pour chaque asso sous le bde, on l'ajoute si c'est un pôle
				if (asso["children"].length !== 0) {
					blocks.push(this.formatPole(asso));
				}
			}
		}
		else {
			//pour le moment, on rajoute le pôle avec ses propres enfants
			blocks.push(this.formatChild(data));
			if(data["children"][0]["children"].length !== 0) {
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

		} */

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

	// TODO: des images pour les pôles et les assos
	formatPole(pole, isBDE = false) {
		const { navigation, portailInstance } = this.props;

		return {
			text: pole.shortname,
			extend: false,
			onPress: () => {
				navigation.push('Assos', {
					name: pole.name,
					id: pole.id,
					isChild: true,
					showItSelf: isBDE,
					data: pole,
					portailInstance,
					title: pole.shortname,
				});
			},
			image: pole.image ? { uri: pole.image } : logoBde,
		};
	}

	formatChild(child) {
		const { navigation, portailInstance } = this.props;

		return {
			text: child.shortname,
			extend: false,
			onPress: () => {
				navigation.navigate('Asso', {
					name: child.name,
					id: child.id,
					portailInstance,
				});
			},
			image: child.image ? { uri: child.image } : logoBde,
		};
	}

	render() {
		const { data, isChild, showItSelf } = this.props;

		if (data !== undefined && isChild !== undefined) {
			switch (data) {
				case 'WAIT_LOADING':
					return <Text>Chargement...</Text>;
				case {}:
				case []:
				case '':
					return <View />;
				default:
					return this.AssosBlocks(data, isChild, showItSelf);
			}
		} else {
			return <View />;
		}
	}
}

export default withNavigation(AssosListComponent);
