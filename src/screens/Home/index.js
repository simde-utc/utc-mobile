import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';

import styles from '../../styles'
import { colors } from '../../styles/variables';

import { BlockGrid, BlockFolder } from '../../components/Block'


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

const blocks = [
	{
		content: () => <Text>Samy</Text>,
		onPress: () => { console.log('Cest lui le bg') }
	},
	{
		content: () => <Text>Et Brass</Text>,
	},
	{
		content: () => <BlockFolder blocks={tools} />
	},
]

export default class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Accueil',
	};

	render() {
		return (
			<ScrollView style={{ width: '100%', height: '100%', backgroundColor: '#F00' }}>
				<BlockGrid style={{ backgroundColor: '#0F0' }}
					blocks={ blocks } addTools={ false }
				/>
			</ScrollView>
		);
	}
}
