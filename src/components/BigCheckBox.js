import React from 'react';
import {AppRegistry, TouchableHighlight, View, Image, Text} from 'react-native';

import CheckBox from 'react-native-checkbox-svg';
import { colors } from '../styles/variables';
import styles from '../styles'


export default class BigCheckBox extends React.Component {
	constructor() {
		super();
		this.state = { _checked: false};
		this.onPressButton = this.onPressButton.bind(this)
	}

	onPressButton() {
		this.setState(
			previousState => ({ _checked: !previousState._checked }),
			() => this.props.onChange(this.state._checked)
		);
	}

	render() {
		const viewStyle = {
			borderColor: colors.gray,
			borderWidth: 1,
			borderRadius: 50,
			padding: 15,
			width: this.props.width
		}
		return (
			<TouchableHighlight onPress={this.onPressButton} underlayColor={"#fff0"}>
				<View style={viewStyle}>
					<CheckBox onChange={this.onPressButton} checked={this.props.checked}
						label={this.props.label} labelStyle={this.props.labelStyle} style={this.props.style}/>
				</View>
			</TouchableHighlight>
		);
	}
}
