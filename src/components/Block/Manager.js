import React from 'react'
import { View, Text } from 'react-native'

import RowBlock from './Row'

import styles from '../../styles'

export default class BlockManager extends React.Component {
    constructor (props) {
        super(props)
    }

    row (config, index) {
        return (
            <RowBlock key={ index }
                style={ this.props.rowStyle }
                blocks={ config }
                editMode={ this.props.editMode }
                onEditMode={ (editMode) => { this.props.onEditMode && this.props.onEditMode(editMode) } }
                deleteMode={ this.props.deleteMode }
                onDeleteMode={ (deleteMode) => { this.props.onDeleteMode && this.props.onDeleteMode(deleteMode) } }
            />
        )
    }

    rows (config) {
        index = 0
        rows = []
        blocks = []

        // Un manager ne supporte que 2 lignes de 2 blocks chacun max
        for (i = 0; i < config.length && rows.length < 2; i++) {
            if (config[i].extend) {
                if (blocks.length > 0) {
                    rows.push(this.row(blocks, index++))
                    blocks = []
                }

                blocks.push(config[i])
            }
            else {
                blocks.push(config[i])

                if (blocks.length < 2)
                    continue
            }

            if (rows.length < 2) {
                rows.push(this.row(blocks, index++))
                blocks = []
            }
        }

        if (rows.length < 2 && blocks.length > 0)
            rows.push(this.row(blocks, index++))

        while (this.props.plainEmpty && rows.length < 2)
            rows.push(this.row([{}, {}], index++))

        return rows
    }

    render () {
		return (
            <View
                style={ this.props.style }
            >
                { this.rows(this.props.blocks) }
            </View>
		)
	}
}
