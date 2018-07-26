import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';

import styles from '../../styles'
import { colors } from '../../styles/variables';

import { BlockGrid, BlockFolder } from '../../components/Block'

const blocks = [
	{
		content: () => <Text>Samy</Text>,
		onPress: () => { console.log('Cest lui le bg') }
	},
	{
		content: () => <Text>Et Brass</Text>,
	},
]

export default class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Accueil',
	};

	render() {
		return (
			<ScrollView style={{ width: '100%', height: '100%' }}>
				<BlockGrid
					blocks={ blocks }
					onDeleteItem={ (item) => console.log(item) }
				/>
			</ScrollView>
		);
	}
}
