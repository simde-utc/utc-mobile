/**
 * Affiche un menu de filtrage
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableHighlight } from 'react-native';

import styles from '../styles'

const viewStyle = {
	height: 75,
	width: '100%',
	paddingHorizontal: 20,
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
}

const filtersStyle = {
	flexDirection: 'row',
	marginLeft: 20,
	flex: 1,
	transform: [
		{ scaleX: -1 },
	],
}

const filterStyle = {
	paddingHorizontal: 7,
	transform: [
		{ scaleX: -1 },
	],
}

const filterTextStyle = {
	borderRadius: 10,
	paddingHorizontal: 5,
	paddingVertical: 1,
}

const searchStyle = {
	minWidth: 25,
	height: 25,
	backgroundColor: 'red'
}

// /!\ Attention, à cause d'un bug React native, il est nécessaire de tout inverser pour que le scrollview s'affiche bien
export default class Filter extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			search: ''
		}
	}

	componentDidMount() {
		// Il faut qu'on réinverse ici aussi
		setTimeout(() => {
			this.scrollView.scrollToEnd({ animated: false })
		}, 10)
	}

	renderFilter(id, name) {
		var style = [
			filterStyle
		]

		var textStyle = [
			filterTextStyle
		]

		if (id + 1 < this.props.filters.length) {
			style.push({
				borderRightWidth: 2,
			})
			style.push(styles.border.yellow)
		}

		if ((this.props.selectedFilters || []).includes(name)) {
			textStyle.push(styles.bg.yellow)

			var onPress = this.props.onFilterUnselected
		}
		else
			var onPress = this.props.onFilterSelected

		return (
			<TouchableHighlight style={ style }
				key={ id }
				onPress={() => { onPress && onPress(name) }}
				underlayColor={"#fff0"}
			>
				<Text style={ textStyle }>
					#{ name }
				</Text>
			</TouchableHighlight>
		)
	}

	render() {
		return (
			<View style={ viewStyle } >
				<TextInput style={ searchStyle }
					underlineColorAndroid='transparent'
					placeHolder={ this.props.searchText || 'Rechercher' }
					value={ this.state.search }
					onChangeText={(text) => this.setState(() => { return { search: text } })}
					autoCapitalize="none"
					autoCorrect={ false }
					secureTextEntry={ true }
				/>
				<ScrollView
					ref={(component) => ( this.scrollView = component )}
					style={ filtersStyle }
					horizontal={ true }
					showsHorizontalScrollIndicator={ false }
				>
					{ this.props.filters.map((filter, id) => {
						return this.renderFilter(id, filter)
					}).reverse() }
				</ScrollView>
			</View>
		)
	}
}
