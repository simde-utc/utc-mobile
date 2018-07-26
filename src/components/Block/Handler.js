import React from 'react'
import { ScrollView, View, Text } from 'react-native'

import BlockManager from './Manager'

import styles from '../../styles'

export default class BlockHandler extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            editMode: this.props.editMode,
            deleteMode: this.props.deleteMode,
        }
    }

    manager (config, index) {
        return <BlockManager key={ index }
            style={ this.props.style }
            editMode={ this.state.editMode }
            onEditMode={ this.onEditModeChange.bind(this) }
            deleteMode={ this.state.deleteMode }
            onDeleteMode={ this.onDeleteModeChange.bind(this) }
            blocks={ config }
        />
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

    managers (_config) {
        config = _config.slice(0)
        index = 0
        managers = []
        blocks = []
        count = 0

        if (this.props.addTools !== false) {
            const toolBlocks = [
                {
                    children: (
                        <Text style={[ styles.text.h0, styles.text.lightGray ]}>+</Text>
                    ),
                    editable: false,
                    deletable: false,
                },
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

        // Un manager ne supporte que 2 lignes de 2 blocks chacun max
        for (i = 0; i < config.length; i++) {
            if (config[i].extend) {
                count += 2

                if (count > 4) {
                    managers.push(this.manager(blocks, index++))

                    blocks = []
                    count = 2
                }

                blocks.push(config[i])
            }
            else {
                blocks.push(config[i])

                count++
            }

            if (count < 4)
                continue

            managers.push(this.manager(blocks, index++))

            blocks = []
            count = 0
        }

        if (blocks.length > 0)
            managers.push(this.manager(blocks, index++))

        return managers
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
                { this.managers(this.props.blocks) }
            </ScrollView>
		)
	}
}
