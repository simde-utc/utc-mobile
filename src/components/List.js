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

import Icon from './Icon';
import News from '../img/icons/news.png';
import Map from '../img/icons/map.png';
import Bell from '../img/icons/bell.png';
import Calendar from '../img/icons/calendar.png';
import Arrow from '../img/icons/arrow_yellow.png';

const nativeIcons = ['news', 'map', 'bell', 'calendar'];

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

	static iconKeyToSvg(key) {
		switch (key) {
			case 'news':
				return News;
			case 'map':
				return Map;
			case 'bell':
				return Bell;
			case 'calendar':
			default:
				return Calendar;
		}
	}

	static isNativeIcon(icon) {
		return nativeIcons.includes(icon);
	}

	constructor(props) {
		super(props);

		this.renderItem = this.renderItem.bind(this);
		this.isNativeIcon = this.isNativeIcon.bind(this);
		this.iconKeyToSvg = this.iconKeyToSvg.bind(this);
	}

	renderItem({ item }) {
		const { arrow } = this.props;

		return (
			<TouchableHighlight underlayColor="#ffffff" activeOpacity={50} onPress={item.onPress}>
				<View style={item.customElmtStyle || listStyle.rowWithArrowView}>
					<View style={listStyle.elementView}>
						<View style={listStyle.iconContainer}>
							{item.icon &&
								(this.isNativeIcon(item.icon) ? (
									<Icon
										style={listStyle.icon}
										height={25}
										width={25}
										image={this.iconKeyToSvg(item.icon)}
									/>
								) : (
									<Image source={item.icon} style={{ height: 25, width: 25 }} />
								))}
						</View>
						<Text style={listStyle.text}>{item.text}</Text>
					</View>
					{arrow && <Icon style={listStyle.arrowStyle} height={25} width={25} image={Arrow} />}
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
				keyExtractor={keyExtractor || this.keyExtractor}
				renderItem={renderItem || this.renderItem}
			/>
		);
	}
}
