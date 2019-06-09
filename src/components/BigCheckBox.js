import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { colors } from '../styles/variables';
import styles from '../styles'


export default class BigCheckBox extends React.Component {
	getCheckBox() {
		const { checked } = this.props;

		return <FontAwesomeIcon icon={['far', checked ? 'check-square' : 'square']} size={ 22 } style={{ marginRight: 10, color: colors.yellow }} />;
	}

	render() {
		return (
			<TouchableHighlight onPress={this.props.onPress} underlayColor={"#fff0"}>
				<View style={ styles.bigButton }>
					{this.getCheckBox()}
					<Text style={ this.props.labelStyle }>{ this.props.label }</Text>
				</View>
			</TouchableHighlight>
		);
	}
}
