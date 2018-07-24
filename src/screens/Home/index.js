import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';

import BlockHandler from '../../components/Block'

import styles from '../../styles'
import { colors } from '../../styles/variables';

const config = [
    {
        children: (
            <Text style={ styles.bg.yellow }>Lorem Ipsum !!</Text>
        ),
        extend: true,
        style: styles.bg.lightGray,
		onPress: () => {
			console.log('Lorem Ipsum')
		}
    },
    {
        text: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
        style: styles.bg.lightGray
    },
    [
        {
            text: 'SiMDE',
            style: styles.bg.lightGray
        },
		{
            text: 'MapUTC',
            style: styles.bg.lightGray
        },
        {
            children: (
				<Text style={[ styles.text.h2, styles.text.center ]}>12 €</Text>
			),
			image: require('../../img/payutc.png'),
			extend: true,
            style: styles.bg.lightGray
        },
    ],
	{
		image: require('../../img/logo_utc.png'),
		style: styles.bg.lightGray
	},
]

export default class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Accueil',
	};

	render () {
		return (
			<BlockHandler
				style={{ backgroundColor: '#0f0' }}
				blocks={ config }
			/>
		);
	}
}
