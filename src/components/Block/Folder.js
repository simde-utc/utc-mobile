import React from 'react'

import BlockGrid from './Grid'

import styles from '../../styles'

export default class BlockFolder extends React.Component {
    constructor (props) {
        super(props)
    }

    _getConfig (_config) {
        config = []
        space = 0

        // Un folder ne supporte que 2 lignes de 2 blocks chacun max
        for (i = 0; i < _config.length && space < 4; i++) {
            space += _config[i] && _config[i].extend ? 2 : 1

            if (space <= 4)
                config.push(_config[i] || {})
        }

        while (this.props.plainEmpty && space++ < 4)
            config.push({})

        return config
    }

    render () {
		return (
            <BlockGrid style={ this.props.style }
                id={ this.props.id }
                blocks={ this._getConfig(this.props.blocks) }
                blockStyle={{ marginBottom: 0 }}
                editMode={ this.props.editMode }
                onEditMode={ (editMode) => { this.props.onEditMode && this.props.onEditMode(editMode) } }
                deleteMode={ this.props.deleteMode }
                onDeleteMode={ (deleteMode) => { this.props.onDeleteMode && this.props.onDeleteMode(deleteMode) } }
                onPressNewBlock={ (index) => { this.props.onPressNewBlock && this.props.onPressNewBlock(index) } }
            />
		)
	}
}
