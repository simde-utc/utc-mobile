import React from 'react';
import { View } from 'react-native';

import Block from './Block';
import BlockFolder from './Folder';
import VoidBlock from './Void';

import styles from '../../styles';

export default class GridBlock extends React.Component {
	getId(index) {
		const { id: propsId } = this.props;

		const id = Array.isArray(propsId) ? propsId.slice(0) : [];

		id.push(index);

		return id;
	}

	voidBlock(visible, index) {
		const { editMode, onEditMode, onPressNewBlock } = this.props;

		return (
			<VoidBlock
				key={index}
				id={this.getId(index)}
				style={styles.block['2-2']}
				editMode={editMode || visible}
				onEditMode={editMode => {
					onEditMode && onEditMode(editMode);
				}}
				deleteMode={false}
				onDeleteMode={() => {}}
				onPress={index => {
					onPressNewBlock && onPressNewBlock(index);
				}}
			/>
		);
	}

	block(config, index) {
		const {
			style: propsStyle,
			blockStyle,
			editMode,
			onEditMode,
			deleteMode,
			onDeleteMode,
			onPressNewBlock,
		} = this.props;
		const blockFolderStyle = [styles.block['2-2'], styles.block.folder, propsStyle];

		if (Array.isArray(config)) {
			return (
				<BlockFolder
					key={index}
					id={this.getId(index)}
					style={blockFolderStyle}
					blocks={config}
					editMode={editMode}
					onEditMode={editMode => {
						onEditMode && onEditMode(editMode);
					}}
					deleteMode={deleteMode}
					onDeleteMode={deleteMode => {
						onDeleteMode && onDeleteMode(deleteMode);
					}}
					onPressNewBlock={index => {
						onPressNewBlock && onPressNewBlock(index);
					}}
					plainEmpty
				/>
			);
		}

		const style = [config.style, styles.block[`${config.extend ? '1' : '2'}-2`], blockStyle];

		if (config.text || config.image || config.children) {
			return (
				<Block
					key={index}
					id={this.getId(index)}
					onPress={config.onPress}
					style={style}
					editStyle={config.editStyle}
					editMode={editMode}
					onEditMode={editMode => {
						onEditMode && onEditMode(editMode);
					}}
					deleteMode={deleteMode}
					onDeleteMode={deleteMode => {
						onDeleteMode && onDeleteMode(deleteMode);
					}}
					text={config.text}
					image={config.image}
					extend={config.extend}
					editable={config.editable}
					deletable={config.deletable}
				>
					{config.children}
				</Block>
			);
		}
		return this.voidBlock(false, index);
	}

	blocks(config) {
		const blocks = config.map((block, index) => {
			return this.block(block, index);
		});

		if (config.length === 0) blocks.push(this.voidBlock(true, 0));
		/*
        if (config.length === 1 && !config[0].extend)
            blocks.push(this.voidBlock(false, 1))
*/
		return blocks;
	}

	render() {
		const { style, blocks } = this.props;
		return <View style={[styles.block.grid, style]}>{this.blocks(blocks)}</View>;
	}
}
