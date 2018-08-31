import React from 'react'
import { ScrollView, View, Text } from 'react-native'

import BlockGrid from './Grid'

import styles from '../../styles'

export default class BlockHandler extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            blocks: this.props.blocks,
            editMode: this.props.editMode,
            deleteMode: this.props.deleteMode,
        }
    }

    onEditModeChange (editMode) {
        if (this.props.onEditMode)
            this.props.onEditMode(editMode)

        this.setState((prevState) => {
            prevState.editMode = editMode

            return prevState
        })
    }

    onDeleteModeChange (deleteMode) {
        if (this.props.onDeleteMode)
            this.props.onDeleteMode(deleteMode)

        this.setState((prevState) => {
            prevState.deleteMode = deleteMode

            return prevState
        })
    }

    _getConfig (_config) {
        config = _config.slice(0)

        if (this.props.addTools !== false) {
            const toolBlocks = [
                {},
                {
                    text: 'Nouveau dossier',
                    editable: false,
                    deletable: false,
                },
                {
                    children: (
                        <View style={[ styles.container.center, this.state.editMode ? styles.bg.lightGray : {} ]}>
                            <Text style={{ textAlign: 'center' }}>Mode édition</Text>
                        </View>
                    ),
                    editable: false,
                    deletable: false,
                    onPress: () => {
                        this.onEditModeChange(!this.state.editMode)
                    }
                },
                {
                    children: (
                        <View style={[ styles.container.center, this.state.deleteMode ? { backgroundColor: '#F00' } : {} ]}>
                            <Text style={{ textAlign: 'center' }}>Mode suppression</Text>
                        </View>
                    ),
                    editable: false,
                    deletable: false,
                    onPress: () => {
                        this.onDeleteModeChange(!this.state.deleteMode)
                    }
                }
            ]

            config.push(toolBlocks)
        }

        return config
    }

    render() {
        const style = [
            {
                paddingVertical: 5
            },
            this.props.style
        ]

		return (
            <ScrollView style={ style }>
                <BlockGrid
                    style={ this.props.style }
                    editMode={ this.state.editMode }
                    onEditMode={ this.onEditModeChange.bind(this) }
                    deleteMode={ this.state.deleteMode }
                    onDeleteMode={ this.onDeleteModeChange.bind(this) }
                    blocks={ this._getConfig(this.state.blocks) }
                    onPressNewBlock={(index) => {
                        // Si on demande d'ajouter un block via l'utlitaire, on ajoute un block dans la grille global,
                        // pas dans le dossier d'outils
                        if (this.props.addTools !== false && index[0] === this.props.blocks.length)
                            index = [ index[0] ]

                        if (this.props.onPressNewBlock)
                            this.props.onPressNewBlock(index)
                    }}
                    onToggleFolder={ (index) => { this.props.onToggleFolder && this.props.onToggleFolder(index) } }
                    onResize={ (index) => { this.props.onResize && this.props.onResize(index) } }
                    onSwitch={ (index) => { this.props.onSwitch && this.props.onSwitch(index) } }
                    onDelete={ (index) => { this.props.onDelete && this.props.onDelete(index) } }
                />
            </ScrollView>
		)
	}
}
