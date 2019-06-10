/**
 * Affiche une ligne horizontale
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
 * */

import React from 'react';
import { View } from 'react-native';

const Hr = ({ style }) => (
	<View
		style={[{ height: 1, width: '100%', marginVertical: 20, backgroundColor: 'black' }, style]}
	/>
);

export default Hr;
