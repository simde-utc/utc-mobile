import React from 'react';
import Button from 'react-native-button';

import styles from '../styles'


export default class BigButton extends React.Component {
	render() {
		const btnStyle = [ styles.get('bigButton', 'bg.lightBlue', 'text.white'), this.props.style ];
		return (
			<Button	style={ btnStyle } onPress={ (checked) => this.props.onPress(checked) }>
				{ this.props.label }
			</Button>
		);
	}
}
