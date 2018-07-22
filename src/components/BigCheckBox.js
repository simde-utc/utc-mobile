import React from 'react';
import { TouchableHighlight, View } from 'react-native';

import CheckBox from 'react-native-checkbox-svg';
import { colors } from '../styles/variables';
import styles from '../styles'


export default class BigCheckBox extends React.Component {
	render() {
		const viewStyle = {
			borderColor: colors.gray,
			borderWidth: 1,
			borderRadius: 50,
			padding: 15,
			margin: 5,
			alignItems: 'center',
			justifyContent: 'center',
			width: this.props.width || 250
		}
		return (
			<TouchableHighlight onPress={this.onPressButton} underlayColor={"#fff0"}>
				<View style={viewStyle}>
					<CheckBox
						checked={ this.props.checked } 
						onChange={ (checked) => this.props.onChange(checked) }
						label={ this.props.label }
						labelBefore={ true }
						style={ this.props.style }
					/>
				</View>
			</TouchableHighlight>
		);
	}
}
