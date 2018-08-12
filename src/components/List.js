/**
 * Affiche une liste
 * @author Alexandre Brasseur <alexandre.brasseur@etu.utc.fr>, Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableHighlight } from 'react-native';

import Icon from './Icon';
import News from '../img/icons/news.svg'
import Map from '../img/icons/map.svg'
import Bell from '../img/icons/bell.svg'
import Calendar from '../img/icons/calendar.svg'
import Arrow from '../img/icons/arrow_yellow.svg'

const nativeIcons = ["news", "map", "bell", "calendar"]

const listStyle = StyleSheet.create({
	container: {
		justifyContent: 'center',
		paddingHorizontal: 30,
		paddingVertical: 20
	},
	elementView: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginVertical: 8,
		marginHorizontal: 20,
	},
	iconContainer: {
		marginRight: 15
	},
	rowWithArrowView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	text: {
		fontSize: 14
	},

	arrowStyle: {

	},

	icon: {

	},
});

export default class List extends React.Component {

	constructor(props) {
		super(props);
		this._renderItem = this._renderItem.bind(this);
		this._isNativeIcon = this._isNativeIcon.bind(this);
		this._iconKeyToSvg = this._iconKeyToSvg.bind(this);
		listStyle = this.props.style || listStyle;
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
		return (<TouchableHighlight underlayColor='#ffffff' activeOpacity={50} onPress={item.onPress}>
			<View style={item.customElmtStyle || listStyle.rowWithArrowView}>
				<View style={ listStyle.elementView }>
					<View style={listStyle.iconContainer}>{item.icon && (this._isNativeIcon(item.icon) ? <Icon style={listStyle.icon} height={25} width={25} image={this._iconKeyToSvg(item.icon)} /> : <Image source={item.icon} style={{height : 25, width : 25}}/> )}</View>
					<Text style={ listStyle.text }>{ item.text }</Text>
				</View>
				{this.props.arrow && <Icon style={listStyle.arrowStyle} height={25} width={25} image={Arrow} />}
			</View>
			</TouchableHighlight>
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
