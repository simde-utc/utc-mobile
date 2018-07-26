import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';

import BlockHandler from '../../components/Block'

import styles from '../../styles'
import { colors } from '../../styles/variables';

export default class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Accueil',
	};

	render () {
		const navigation = this.props.navigation

		const config = [
		    {
		        children: (
		            <Text>Je veux voir mon intro !!</Text>
		        ),
		        extend: true,
				onPress: function () {
					navigation.navigate('Welcome')
				}
		    },
		    [
				{
				},
				{
					text: "Samy je te jure <3",
				}
			],
		    [
		        {
		            text: 'SiMDE',
		        },
				{
		            text: 'MapUTC',
		        },
		        {
		            children: (
						<Text style={[ styles.text.h2, styles.text.center ]}>12 €</Text>
					),
					image: require('../../img/payutc.png'),
					extend: true,
		        },
		    ],
			{
				image: require('../../img/logo_utc.png'),
			},
		]

		return (
			<BlockHandler
				blocks={ config }
				editMode={ true }
				deleteMode={ true }
			/>
		);
	}
}
