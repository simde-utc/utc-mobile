import React from 'react';
import { Text } from 'react-native';

import Block from './Block'

import { colors } from '../../styles/variables';
import styles from '../../styles'

export default class Void extends React.Component {
    render() {
        const style = [
            {
                borderStyle: 'dashed',
                opacity: 0
            },
            this.props.style
        ]

        const labelStyle = [
            styles.text.h0,
            styles.text.lightGray
        ]

        const editStyle = [
            {
                opacity: 1
            },
            this.props.editStyle
        ]

		return (
            <Block style={ style }
                editStyle={ editStyle }
                editMode={ this.props.editMode }
                onEditMode={ (editMode) => { this.props.onEditMode && this.props.onEditMode(editMode) } }
                deleteMode={ this.props.deleteMode }
                onDeleteMode={ (deleteMode) => { this.props.onDeleteMode && this.props.onDeleteMode(deleteMode) } }
                editable={ false }
                deletable={ false }
                onPress={ () => { this.props.onPress && this.props.onPress([ this.props.id ]) } }
            >
                <Text style={ labelStyle }>+</Text>
            </Block>
		);
	}
}
