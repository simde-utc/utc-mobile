import React from 'react';
import { Text } from 'react-native'
import SortableGrid from 'react-native-sortable-grid';

import styles from '../../styles'

import Block from './Block'

export default class Grid extends React.Component {
	mapDataToChildren() {
		return this.props.data.map((item, index) => (
			<Block key={ index }
				content={ () => <Text>{ item }</Text> }
			>
			</Block>
		))
	}

	render() {
		const style = [
			styles.container.grid,
			this.props.style
		]

		return (
			<SortableGrid
				style={ style }
				blockTransitionDuration={ 400 }
				activeBlockCenteringDuration={ 200 }
				itemsPerRow={ 2 }
				dragActivationTreshold={ 200 }
				onDragRelease={ (itemOrder) => {} }
			>
				{ this.props.children ? this.props.children : this.mapDataToChildren() }
			</SortableGrid>
		);
	}

}
