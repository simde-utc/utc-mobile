import React from 'react'
import { View, Text } from 'react-native'

import Block from './Block'
import BlockManager from './Manager'
import VoidBlock from './Void'

import styles from '../../styles'

export default class RowBlock extends React.Component {
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
        const blockManagerStyle = [
            styles.block['2-2'],
            styles.bg.lightBlue,
            {
        		justifyContent: 'space-between',
        		alignContent: 'space-between',
            },
            this.props.style,
        ]

        const rowStyle = {
            justifyContent: 'space-between',
            alignContent: 'space-between',
            paddingHorizontal: 0,
            paddingBottom: 0,
            backgroundColor: '#F00'
        }

        if (Array.isArray(config)) {
            return (
                <BlockManager key={ index }
                    style={ blockManagerStyle }
                    rowStyle={ rowStyle }
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
                    text={ config.text }
                    image={ config.image }
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
            <View style={[ styles.block.row, styles.bg.yellow, this.props.style ]}>
                { this.blocks(this.props.blocks) }
            </View>
		)
	}
}
