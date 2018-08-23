/**
 * Affiche un menu de filtrage
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { View, Text, TextInput } from 'react-native';

import styles from '../styles'

const viewStyle = {
	flexDirection: 'row',
	justifyContent: 'space-between'
}

export default class Filter extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			search: ''
		}
	}

	renderFilter(id, name) {
		return (
			<Text
				key={ id }
			>
				#{ name }
			</Text>
		)
	}

	render() {
		return (
			<View style={ viewStyle } >
				<TextInput style={{}}
					underlineColorAndroid='transparent'
					placeHolder={ this.props.searchText || 'Rechercher' }
					value={ this.state.search }
					onChangeText={(text) => this.setState(() => { return { search: text } })}
					autoCapitalize="none"
					autoCorrect={ false }
					secureTextEntry={ true }
				/>
				<View>
					{ this.props.filters.forEach((filter, id) => {
						return this.renderFilter(id, filter)
					}) }
				</View>
			</View>
		)
	}
}
