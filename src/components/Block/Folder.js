import React from 'react';
import { View } from 'react-native'

import styles from '../../styles'

import Block from './Block'
import BlockGrid from './Grid'

export default class Folder extends React.Component {
	render() {
		const style = [
			styles.block.folder,
			this.props.style
		]

		return (
			<Block
				content={ () => (
					<BlockGrid style={ style }
						blocks={ this.props.blocks }
						addTools={ false }
						fixed={ this.props.fixed }
					/>
				)}
			/>
		);
	}
}
