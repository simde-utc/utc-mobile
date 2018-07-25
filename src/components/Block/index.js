import React from 'react'
import { ScrollView, Text } from 'react-native'

import BlockManager from './Manager'

import styles from '../../styles'

export default class BlockHandler extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            editMode: this.props.editMode
        }
    }

    manager (config, index) {
        return <BlockManager key={ index }
            style={ this.props.style }
            editMode={ this.state.editMode }
            onEditMode={ this.onEditModeChange.bind(this) }
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

    managers (config) {
        index = 0
        managers = []
        blocks = []
        count = 0

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
