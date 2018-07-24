import React from 'react'
import { View, Text } from 'react-native'

import BlockRow from './Row'

import styles from '../../styles'

const config = [
    {
        children: (
            <Text>Samy tu es un génie !!</Text>
        ),
        extend: true,
        style: styles.bg.lightGray
    }
]

const config2 = [
    {
        children: (
            <Text>Je lavoue, il est si beau, si charmant, si, si, si, si, si</Text>
        ),
        style: styles.bg.lightGray
    }
]

export default class BlockManager extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            editMode: this.props.editMode || false
        }
    }

    render() {
		return (
            <View>
                <BlockRow style={ styles.bg.lightBlue }
                    blocks={ config }
                />
                <BlockRow style={ styles.bg.lightBlue }
                    blocks={ config2 }
                />
            </View>
		)
	}
}
