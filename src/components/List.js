/**
 * Affiche une liste
 * @author Alexandre Brasseur <alexandre.brasseur@etu.utc.fr>, Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import Icon from './Icon';
import News from '../img/icons/news.svg'
import Map from '../img/icons/map.svg'
import Bell from '../img/icons/bell.svg'
import Calendar from '../img/icons/calendar.svg'

const nativeIcons = ["news", "map", "bell", "calendar"]

const listStyle = StyleSheet.create({
	container: {
		justifyContent: 'center',
		paddingHorizontal: 30,
		paddingVertical: 20
	},
	view: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginVertical: 8,
		marginHorizontal: 20,
	},
	icon: {
		marginRight: 15
	},
	text: {
		fontSize: 14
	}
});

export default class List extends React.Component {

	constructor(props) {
		super(props);
		this._renderItem = this._renderItem.bind(this);
		this._isNativeIcon = this._isNativeIcon.bind(this);
		this._iconKeyToSvg = this._iconKeyToSvg.bind(this);
	}
	
	_keyExtractor(item, index) {
		return String(index);
	}

	_iconKeyToSvg(key) {
		switch (key) {
			case "news":
				return News;
				break;
			case "map":
				return Map;
				break;
			case "bell":
				return Bell;
				break;
			case "calendar":
				return Calendar;
				break;
		}
	}

	_isNativeIcon(icon) {
		return nativeIcons.includes(icon);
	}

	_renderItem({ item }) {
		return (
			<View style={ listStyle.view }>
				<View style={listStyle.icon}>{item.icon && (this._isNativeIcon(item.icon) ? <Icon height={25} width={25} image={this._iconKeyToSvg(item.icon)} /> : <Image source={item.icon} style={{height : "25", width : "25"}}/> )}</View>
				<Text style={ listStyle.text }>{ item.text }</Text>
			</View>
		);
	}

	render() {
		return <FlatList 
					contentContainerStyle={ listStyle.container }
					data={ this.props.data }
					keyExtractor={ this.props.keyExtractor ? this.props.keyExtractor : this._keyExtractor }
					renderItem={ this.props.renderItem ? this.props.renderItem : this._renderItem }
				/>;
	}
}
