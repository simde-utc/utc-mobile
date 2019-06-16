import React from 'react';
import { ScrollView, View, Text } from 'react-native';

import BlockGrid from './Grid';

import styles from '../../styles';

export default class BlockHandler extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			blocks: props.blocks,
			editMode: props.editMode,
			deleteMode: props.deleteMode,
		};
	}

	onEditModeChange(editMode) {
		const { onEditMode } = this.props;

		if (onEditMode) {
			onEditMode(editMode);
		}

		this.setState(prevState => {
			prevState.editMode = editMode;

			return prevState;
		});
	}

	onDeleteModeChange(deleteMode) {
		const { onDeleteMode } = this.props;

		if (onDeleteMode) {
			onDeleteMode(deleteMode);
		}

		this.setState(prevState => {
			prevState.deleteMode = deleteMode;

			return prevState;
		});
	}

	getConfig(_config) {
		const { addTools } = this.props;
		const { editMode, deleteMode } = this.state;
		const config = _config.slice(0);

		if (addTools !== false) {
			const toolBlocks = [
				{},
				{
					text: 'Nouveau dossier',
					editable: false,
					deletable: false,
				},
				{
					children: (
						<View style={[styles.container.center, editMode ? styles.bg.lightGray : {}]}>
							<Text style={{ textAlign: 'center' }}>Mode édition</Text>
						</View>
					),
					editable: false,
					deletable: false,
					onPress: () => {
						this.onEditModeChange(!editMode);
					},
				},
				{
					children: (
						<View style={[styles.container.center, deleteMode ? { backgroundColor: '#F00' } : {}]}>
							<Text style={{ textAlign: 'center' }}>Mode suppression</Text>
						</View>
					),
					editable: false,
					deletable: false,
					onPress: () => {
						this.onDeleteModeChange(!deleteMode);
					},
				},
			];

			config.push(toolBlocks);
		}

		return config;
	}

	render() {
		const { style: propsStyle, propsBlocks, addTools, onPressNewBlock } = this.props;
		const { editMode, deleteMode, blocks } = this.state;
		const style = [
			{
				paddingVertical: 5,
			},
			propsStyle,
		];

		return (
			<ScrollView style={style}>
				<BlockGrid
					style={propsStyle}
					editMode={editMode}
					onEditMode={this.onEditModeChange.bind(this)}
					deleteMode={deleteMode}
					onDeleteMode={this.onDeleteModeChange.bind(this)}
					blocks={this.getConfig(blocks)}
					onPressNewBlock={index => {
						// Si on demande d'ajouter un block via l'utlitaire, on ajoute un block dans la grille global,
						// pas dans le dossier d'outils
						if (addTools !== false && index[0] === propsBlocks.length) {
							index = [index[0]];
						}

						if (onPressNewBlock) onPressNewBlock(index);
					}}
				/>
			</ScrollView>
		);
	}
}
