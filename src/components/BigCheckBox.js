import React from 'react';
import { TouchableHighlight, View } from 'react-native';

import CheckBox from 'react-native-checkbox-svg';
import { colors } from '../styles/variables';
import styles from '../styles'


export default class BigCheckBox extends React.Component {
	render() {
		return (
			<TouchableHighlight onPress={this.onPressButton} underlayColor={"#fff0"}>
				<View style={ styles.bigButton }>
					<CheckBox
						checked={ this.props.checked }
						onChange={ (checked) => this.props.onChange(checked) }
						label={ this.props.label }
						labelBefore={ false }
						style={ this.props.style }
					/>
				</View>
			</TouchableHighlight>
		);
	}
}
