import React from 'react'
import { View, Text } from 'react-native'

import Block from './Block'
import VoidBlock from './Void'

import styles from '../../styles'

export default class BlockRow extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            editMode: this.props.editMode || false
        }
    }

    voidBlock (visible, index) {
        if (visible) {
            return (
                <VoidBlock key={ index }
                    style={[ styles.block['2-2'], { opacity: 1 }]}
                    editMode={ this.state.editMode }
                />
            )
        }
        else {
            return (
                <VoidBlock key={ index }
                    style={[ styles.block['2-2'], { opacity: 1 }]}
                    editMode={ this.state.editMode }
                />
            )
        }
    }

    block (config, index) {
        if (Array.isArray(config)) {
            return (
                <Row key={ index }
                    style={ this.props.stye }
                    blocks={ config }
                />
            )
        }
        else {
            var style = [
                config.style,
                styles.block[(config.extend ? '1' : '2') + '-2']
            ]

            return (
                <Block key={ index }
                    onPress={ config.callback }
                    style={ style }
                    editStyle={ config.editStyle }
                    editMode={ this.state.editMode }
                >
                { config.children }
                </Block>
            )
        }
    }

    blocks (config) {
        var blocks = config.map((block, index) => this.block(block, index));

        if (config.length === 0)
            blocks.push(this.voidBlock(true, 0))

        if (config.length === 1 && !config[0].extend)
            blocks.push(this.voidBlock(false, 1))

        return blocks
    }

    render() {
		return (
            <View style={[ styles.block.row, this.props.style ]}>
                { this.blocks(this.props.blocks) }
            </View>
		)
	}
}
