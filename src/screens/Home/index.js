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

		const navigation = this.props.navigation

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

	toggleBlockFolder(index) {
		this.setState((prevState) => {
			toEdit = prevState.config[index[0]]

			if (Array.isArray(toEdit)) {
				toEdit = prevState.config[index[0]][index[1]]
				prevState.config.splice(index[0], 0, toEdit)
				prevState.config[index[0] + 1].splice(index[1], 1)

				for (let i = 0; i < prevState.config[index[0] + 1].length; i++) {
					if (Object.keys(prevState.config[index[0] + 1][i]).length > 0)
						return prevState
				}

				prevState.config.splice(index[0] + 1, 1)
			}
			else
				prevState.config[index[0]] = [ toEdit ]

			return prevState
		})


	}

	resizeBlock(index) {
		this.setState((prevState) => {
			toEdit = prevState.config[index[0]]

			if (Array.isArray(toEdit)) {
				var sum = 0

				for (let i = 0; i < toEdit.length; i++)
          			sum += (toEdit[i] && toEdit[i].extend ? 2 : 1)

				toEdit = toEdit[index[1]]

				if (sum > 3 && !toEdit.extend)
					return

				// Si le block est du côté droit, il doit grantir à gauche
				if (index[1] % 2 === 1) {
					prevState.config[index[0]][index[1]] = prevState.config[index[0]][index[1] - 1]
					prevState.config[index[0]][index[1] - 1] = toEdit
				}
			}
			else {
				if (index[0] % 2 === 1 && !toEdit.extend) {
					prevState.config[index[0]] = prevState.config[index[0] - 1]
					prevState.config[index[0] - 1] = toEdit
				}
			}

			toEdit.extend = !toEdit.extend

			return prevState
		})
	}

	switchBlocks(index) {
		if (this.state.blockToSwitch) {
			this.setState((prevState) => {
				var toSwitch = prevState.config[prevState.blockToSwitch[0]]
				var switchWith = prevState.config[index[0]]

				if (Array.isArray(toSwitch)) {
					toSwitch = toSwitch[prevState.blockToSwitch[1]]

					if (Array.isArray(switchWith)) {
						switchWith = switchWith[index[1]]
						prevState.config[index[0]][index[1]] = toSwitch
					}
					else
						prevState.config[index[0]] = toSwitch

					prevState.config[prevState.blockToSwitch[0]][prevState.blockToSwitch[1]] = switchWith
				}
				else {
					if (Array.isArray(switchWith)) {
						switchWith = switchWith[index[1]]
						prevState.config[index[0]][index[1]] = toSwitch
					}
					else
						prevState.config[index[0]] = toSwitch

					prevState.config[prevState.blockToSwitch[0]] = switchWith
				}

				return prevState
			})
		}
		else {
			this.setState((prevState) => {
				prevState.blockToSwitch = index

				return prevState
			})
		}
	}

	deleteBlock(index) {
		this.setState((prevState) => {
			if (Array.isArray(prevState.config[index[0]]))
				delete prevState.config[index[0]][index[1]]
			else
				delete prevState.config[index[0]]

			return prevState
		})
	}

	render () {
		return (
			<BlockHandler
				blocks={ this.state.config }
				editMode={ true }
				deleteMode={ true }
				onPressNewBlock={ this.addNewBlock.bind(this) }
				onToggleFolder={ this.toggleBlockFolder.bind(this) }
				onResize={ this.resizeBlock.bind(this) }
				onSwitch={ this.switchBlocks.bind(this) }
				onDelete={ this.deleteBlock.bind(this) }
			/>
		);
	}
}
