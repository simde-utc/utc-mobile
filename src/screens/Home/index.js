import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';

import styles from '../../styles'
import { colors } from '../../styles/variables';

import { BlockGrid } from '../../components/Block'

export default class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Accueil',
	};

	render() {
		return (
			<ScrollView style={{ width: '100%', height: '100%', backgroundColor: '#F00' }}>
				<BlockGrid style={[ styles.container.default, { backgroundColor: '#0F0' } ]}
					data={[ 1, 2, 3 ]}
				>
				</BlockGrid>
			</ScrollView>
		);
	}
}
