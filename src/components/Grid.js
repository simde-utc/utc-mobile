import React from 'react';
import { ScrollView } from 'react-native';
import SortableGrid from 'react-native-sortable-grid';


export default class Grid extends React.Component {

	mapDataToChildren() {
		return this.props.data.map((item, index) => (
			<View key={ index }>
				<Text>{ index }</Text>
			</View>
		))
	}

	render() {
		return (
			const containerStyle = [
				styles.py.sm,
				this.props.containerStyle
			]

			<SortableGrid
				style={ containerStyle }
				blockTransitionDuration={ 400 }
				activeBlockCenteringDuration={ 200 }
				itemsPerRow={ 4 }
				dragActivationTreshold={ 200 }
				onDragRelease={ (itemOrder) => this.props.onDragRelease(itemOrder) }
			>
				{ this.props.children ? this.props.children : this.mapDataToChildren() }
			</SortableGrid>
		);
	}

}