import React from 'react';
import { View, Text } from 'react-native'
import SortableGrid from 'react-native-sortable-grid';

import styles from '../../styles'

import Block from './Block'
import Folder from './Folder'

const tools = [
	{
		a: 'a',
		content: () => <Text>+</Text>,
		onPress: () => { console.log('On souhaite ajouter un bloc') }
	},
	{
		content: () => <Text>4</Text>,
		onPress: () => { console.log('On souhaite ajouter un dossier de blocs') }
	},
	{
		content: () => <Text>E</Text>,
		onPress: () => { console.log('On souhaite pouvoir déplacer les blocs') }
	},
	{
		content: () => <Text>x</Text>,
		onPress: () => { console.log('On souhaite supprimer des blocs') }
	},
]

export default class Grid extends React.Component {
	mapDataToChildren() {
		var blocks = this.props.blocks.map((item, index) => (
			<Block key={ index }
				content={ item.content }
				onTap={ item.onPress }
			>
			</Block>
		))

		console.log(this.props.blocks, this.props.addTools !== false)

		if (this.props.addTools !== false) {
			blocks.push(
				<Folder key={ blocks.length }
					blocks={ tools }
					inactive={ true }
				/>
			)
		}

		return blocks
	}

	render() {
		const style = [
			styles.container.grid,
			this.props.style
		]

		return (
			<View>
				<SortableGrid style={ style }
					blockTransitionDuration={ 400 }
					activeBlockCenteringDuration={ 200 }
					itemsPerRow={ 2 }
					dragActivationTreshold={ 200 }
					onDragRelease={ (itemOrder) => {} }
				>
					{ this.props.children ? this.props.children : this.mapDataToChildren() }
				</SortableGrid>
			</View>
		);
	}

}
