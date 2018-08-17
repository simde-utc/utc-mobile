/**
 * Affiche une ligne horizontale
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { View } from 'react-native';

export default class Hr extends React.Component {
	render() {
		return (
			<View style={{height: 1, width: '100%', marginVertical:20, backgroundColor: this.props.color || 'black'}}>
			</View>
		);
	}
}
