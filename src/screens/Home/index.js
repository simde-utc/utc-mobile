import React from 'react';
import { View, Image, Text, ScrollView, Dimensions } from 'react-native';

import BlockHandler from '../../components/Block'

import styles from '../../styles'
import { colors } from '../../styles/variables';

export default class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Accueil',
	};

	constructor (props) {
		super(props)

		this.state = {
			config: [
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
						text: "Samy",
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
		}
	}

	addNewBlock (index) {
		const toAdd = {
			text: 'Je suis nouveau !'
		}

		this.setState((prevState) => {
			if (Array.isArray(prevState.config[index[0]]))
				prevState.config[index[0]][index[1]] = toAdd
			else
				prevState.config[index[0]] = toAdd

			return prevState
		})
	}

	render () {
		const navigation = this.props.navigation

		return (
			<BlockHandler
				blocks={ this.state.config }
				editMode={ true }
				deleteMode={ true }
				onPressNewBlock={ this.addNewBlock.bind(this) }
			/>
		);
	}
}
