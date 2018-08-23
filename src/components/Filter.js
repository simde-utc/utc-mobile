/**
 * Affiche un menu de filtrage
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableHighlight } from 'react-native';

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
	width: 150,
	height: 25,
	flexDirection: 'row',
	alignItems: 'center',
	borderWidth: 1,
	borderRadius: 15,
	borderColor: 'grey',
	backgroundColor: 'white',
}

const searchImageStyle = {
	marginLeft: 5,
	width: 15,
	height: 15,
}

const searchTextStyle = {
	marginHorizontal: 5,
	fontSize: 11,
	flex: 1,
}

const searchLaunchStyle = {
	paddingRight: 5,
	height: '100%',
	alignItems: 'center',
}

const searchLaunchTextStyle = [
	styles.text.yellow,
	{
		height: '100%'
	}
]

// /!\ Attention, à cause d'un bug React native, il est nécessaire de tout inverser pour que le scrollview s'affiche bien
export default class Filter extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			search: '',
			canSearch: false,
		}
	}

	componentDidMount(prevProps, prevState) {
		// Il faut qu'on réinverse ici aussi
		setTimeout(() => {
			this.scrollView.scrollToEnd({ animated: false })
		}, 10)
	}

	onSearch() {
		if (this.state.search.length > 0 && this.props.onSearch && (this.props.searchButton !== false))
			this.onSearch(this.state.search)
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
				<View style={ searchStyle }>
					<Image style={ searchImageStyle }
						source={ require('../img/search.png') }
					/>
					<TextInput style={ searchTextStyle }
						underlineColorAndroid='transparent'
						placeHolder={ this.props.searchText || 'Rechercher' }
						value={ this.props.searchText || this.state.search }
						onChangeText={(text) => {
							if (this.props.onSearchTextChange)
								text = this.props.onSearchTextChange(text) || text

							this.setState(() => { return { canSearch: text.length > 0, search: text } })
						}}
						onSubmitEditing={ this.onSearch.bind(this) }
						autoCapitalize='none'
						keyboardType='email-address'
						autoCorrect={ false }
					/>
					<TouchableHighlight style={[ searchLaunchStyle, this.state.canSearch && (this.props.searchButton !== false) ? {} : { display: 'none' } ]}
						onPress={ this.onSearch.bind(this) }
						underlayColor={ "#fff0" }
					>
						<Text style={ searchLaunchTextStyle }>{ '\u27A4' }</Text>
					</TouchableHighlight>
				</View>
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
