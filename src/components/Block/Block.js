import React from 'react';
import { View } from 'react-native'

import styles from '../../styles'

export default class Block extends React.Component {
	render() {
		const style = [
			styles.block.default,
			this.props.style
		]

		return (
			<View style={ style }>
				{ this.props.content({}) }
			</View>
		);
	}
}
