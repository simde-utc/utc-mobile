/**
 * Affiche une liste
 * @author Alexandre Brasseur <alexandre.brasseur@etu.utc.fr>
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
 * */

import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import i18n from '../utils/i18n';

const listStyle = StyleSheet.create({
	container: {
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	elementView: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginVertical: 8,
		marginHorizontal: 10,
		marginRight: 80,
	},
	iconContainer: {
		marginRight: 15,
	},
	rowWithArrowView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	text: {
		fontSize: 14,
	},

	arrowStyle: {},

	icon: {},
});

export default class List extends React.Component {
	static keyExtractor(item, index) {
		return String(index);
	}

	constructor(props) {
		super(props);

		this.renderItem = this.renderItem.bind(this);
	}

	renderItem({ item: { onPress, icon, text, lazyText, customElmtStyle } }) {
		const { arrow } = this.props;

		return (
			<TouchableHighlight underlayColor="#ffffff" activeOpacity={50} onPress={onPress}>
				<View style={customElmtStyle || listStyle.rowWithArrowView}>
					<View style={listStyle.elementView}>
						<View style={listStyle.iconContainer}>
							<Image source={icon} style={{ height: 24, width: 24 }} />
						</View>
						<Text style={listStyle.text}>{text || i18n.t(lazyText)}</Text>
					</View>
					{arrow && <FontAwesomeIcon style={['fas', 'arrow-right']} size={25} />}
				</View>
			</TouchableHighlight>
		);
	}

	render() {
		const { data, keyExtractor, renderItem } = this.props;

		return (
			<FlatList
				contentContainerStyle={listStyle.container}
				data={data}
				keyExtractor={keyExtractor || List.keyExtractor}
				renderItem={renderItem || this.renderItem}
			/>
		);
	}
}
