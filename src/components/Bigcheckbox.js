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
           this.setState(previousState => {
        return { _checked: !previousState._checked };
      }, function() {
    this.props.onChange(this.state._checked);
  });

    }




  


	render() {

		return (
<TouchableHighlight onPress={this.onPressButton} underlayColor={"#fff0"}>	
		<View style={{borderColor: colors.gray, borderWidth: 1, borderRadius: 50, padding: 15, alignItems: 'center', justifyContent: 'center', width: this.props.width}} >
			<CheckBox onChange={this.onPressButton} checked={this.props.checked} label={this.props.label} labelBefore={true} style={this.props.style}/>
		</View>
</TouchableHighlight>

		);
	}
}
