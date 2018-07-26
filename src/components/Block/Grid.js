import React from 'react';
import { View, Text } from 'react-native'
import SortableGrid from 'react-native-sortable-grid';

import styles from '../../styles'

import Block from './Block'
import Folder from './Folder'

export default class Grid extends React.Component {
	constructor(props) {
		super(props)

		this.tools = [
			{
				content: () => <Text>+</Text>,
				onPress: () => { console.log('On souhaite ajouter un bloc') }
			},
			{
				content: () => <Text>4</Text>,
				onPress: () => { console.log('On souhaite ajouter un dossier de blocs') }
			},
			{
				content: () => <Text>E</Text>,
				onPress: () => this.setState((prevState) => {
					prevState.fixed = !prevState.fixed

					return prevState
				})
			},
			{
				content: () => <Text>x</Text>,
				onPress: () => this.refs.SortableGrid.toggleDeleteMode()
			},
		]

		this.state = {
			fixed: props.fixed || false,
		}
	}

	mapDataToChildren() {
		let blocks = this.props.blocks.slice(0)

		if (this.props.addTools !== false)
			blocks.push(this.tools)

		return blocks.map((item, index) => {
			if (Array.isArray(item)) {
				return (
					<Folder key={ index }
						blocks={ item }
						fixed={ (index + 1 === blocks.length && this.props.addTools !== false) || this.state.fixed }
					/>
				)
			}
			else {
				return (
					<Block key={ index }
						content={ item.content }
						onTap={ item.onPress }
						fixed={ this.state.fixed }
					/>
				)
			}
		})
	}

	render() {
		const style = [
			styles.container.grid,
			this.props.style
		]

		return (
			<View>
				<SortableGrid style={ style }
					blockTransitionDuration={ 200 }
					activeBlockCenteringDuration={ 200 }
					itemsPerRow={ 2 }
					dragActivationTreshold={ 200 }
					onDragRelease={ (itemOrder) => {} }
					onDeleteItem={ this.props.onDeleteItem }
					ref={ 'SortableGrid' }
				>
					{ this.props.children ? this.props.children : this.mapDataToChildren() }
				</SortableGrid>
			</View>
		);
	}

}
