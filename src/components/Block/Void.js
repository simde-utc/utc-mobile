import React from 'react';
import { Text } from 'react-native';

import Block from './Block';

import styles from '../../styles';

export default class Void extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			editMode: props.editMode,
		};
	}

	render() {
		const {
			id,
			style: propsStyle,
			editStyle: propsEditStyle,
			editMode,
			onEditMode,
			deleteMode,
			onDeleteMode,
			onPress,
		} = this.props;

		const style = [
			{
				opacity: 0,
			},
			propsStyle,
		];

		const labelStyle = [styles.text.h0, styles.text.lightGray];

		const editStyle = [
			{
				opacity: 1,
			},
			propsEditStyle,
		];

		return (
			<Block
				style={style}
				editStyle={editStyle}
				editMode={(this.state.editMode = editMode)}
				onEditMode={editMode => {
					this.state.editMode = editMode;

					if (onEditMode) onEditMode(editMode);
				}}
				deleteMode={deleteMode}
				onDeleteMode={deleteMode => {
					onDeleteMode && onDeleteMode(deleteMode);
				}}
				editable={false}
				deletable={false}
				onPress={() => {
					editMode && onPress && onPress(id);
				}}
			>
				<Text style={labelStyle}>+</Text>
			</Block>
		);
	}
}
