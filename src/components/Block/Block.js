import React from 'react';
import { TouchableHighlight, View } from 'react-native';

import styles from '../../styles'

export default class Block extends React.Component {
    render() {
        const style = [
            {
                borderRadius: 10
            },
            this.props.style
        ]

		return (
			<TouchableHighlight underlayColor={"#fff0"}
                style={ style }
            >
                { this.props.children }
			</TouchableHighlight>
		);
	}
}
