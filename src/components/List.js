import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const listStyle = StyleSheet.create({
	container: {
		justifyContent: 'center',
		paddingHorizontal: 30,
		paddingVertical: 20
	},
	view: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginVertical: 8,
		marginHorizontal: 20,
	},
	icon: {
		backgroundColor: '#444',
		marginRight: 15
	},
	text: {
		fontSize: 14
	}
});

export default class List extends React.Component {

	_keyExtractor(item, index) {
		return String(index);
	}

	_renderItem({ item }) {
		// TODO : icon
		return (
			<View style={ listStyle.view }>
				{ item.icon && <View height={30} width={30} style={ listStyle.icon} /> }
				<Text style={ listStyle.text }>{ item.text }</Text>
			</View>
		);
	}

	render() {
		return <FlatList 
					contentContainerStyle={ listStyle.container }
					data={ this.props.data }
					keyExtractor={ this.props.keyExtractor ? this.props.keyExtractor : this._keyExtractor }
					renderItem={ this.props.renderItem ? this.props.renderItem : this._renderItem }
				/>;
	}
}
