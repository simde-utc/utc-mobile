import React from 'react'
import { View, Text } from 'react-native'

import Block from './Block'
import BlockFolder from './Folder'
import VoidBlock from './Void'

import styles from '../../styles'

export default class GridBlock extends React.Component {
    _getId (index) {
        var id = Array.isArray(this.props.id) ? this.props.id.slice(0) : []

        id.push(index)

        return id
    }

    voidBlock (visible, index) {
        return (
            <VoidBlock key={ index }
                id={ this._getId(index) }
                style={ styles.block['2-2'] }
                editMode={ this.props.editMode || visible }
                onEditMode={ (editMode) => { this.props.onEditMode && this.props.onEditMode(editMode) } }
                deleteMode={ false }
                onDeleteMode={ () => {} }
                onPress={ (index) => { this.props.onPressNewBlock && this.props.onPressNewBlock(index) } }
            />
        )
    }

    block (config, index) {
        const blockFolderStyle = [
            styles.block['2-2'],
            {
        		justifyContent: 'space-between',
        		alignContent: 'space-between',
                marginBottom: 0,
            },
            this.props.style,
        ]

        const gridStyle = {
            justifyContent: 'space-between',
            alignContent: 'space-between',
            paddingHorizontal: 0,
            paddingBottom: 0,
        }

        if (Array.isArray(config)) {
            return (
                <BlockFolder key={ index }
                    id={ this._getId(index) }
                    style={ blockFolderStyle }
                    gridStyle={ gridStyle }
                    blocks={ config }
                    editMode={ this.props.editMode }
                    onEditMode={ (editMode) => { this.props.onEditMode && this.props.onEditMode(editMode) } }
                    deleteMode={ this.props.deleteMode }
                    onDeleteMode={ (deleteMode) => { this.props.onDeleteMode && this.props.onDeleteMode(deleteMode) } }
                    onPressNewBlock={ (index) => { this.props.onPressNewBlock && this.props.onPressNewBlock(index) } }
                    plainEmpty={ true }
                />
            )
        }
        else {
            var style = [
                config.style,
                styles.block[(config.extend ? '1' : '2') + '-2']
            ]

            if (config.text || config.image || config.children) {
                return (
                    <Block key={ index }
                        id={ this._getId(index) }
                        onPress={ config.onPress }
                        style={ style }
                        editStyle={ config.editStyle }
                        editMode={ this.props.editMode }
                        onEditMode={ (editMode) => { this.props.onEditMode && this.props.onEditMode(editMode) } }
                        deleteMode={ this.props.deleteMode }
                        onDeleteMode={ (deleteMode) => { this.props.onDeleteMode && this.props.onDeleteMode(deleteMode) } }
                        text={ config.text }
                        image={ config.image }
                        extend={ config.extend }
                        editable={ config.editable }
                        deletable={ config.deletable }
                    >
                        { config.children }
                    </Block>
                )
            }
            else
                return this.voidBlock(false, index)
        }
    }

    blocks (config) {
        var blocks = config.map((block, index) => {
            return this.block(block, index)
        });

        if (config.length === 0)
            blocks.push(this.voidBlock(true, 0))
/*
        if (config.length === 1 && !config[0].extend)
            blocks.push(this.voidBlock(false, 1))
*/
        return blocks
    }

    render() {
		return (
            <View style={[ styles.block.grid, this.props.style ]}>
                { this.blocks(this.props.blocks) }
            </View>
		)
	}
}
