import React from 'react';
import Button from 'react-native-button';

import styles from '../styles'


export default class BigButton extends React.Component {
	render() {
		return (
			<Button	style={[ styles.bigButton, styles.lightBlueBg, styles.whiteText, this.props.style ]}
				onPress={ (checked) => this.props.onPress(checked) }
			>
				{ this.props.label }
			</Button>
		);
	}
}
