import React from 'react';

import BlockGrid from './Grid';

export default class BlockFolder extends React.Component {
	getConfig(_config) {
		const { plainEmpty } = this.props;
		const config = [];
		let space = 0;

		// Un folder ne supporte que 2 lignes de 2 blocks chacun max
		for (let i = 0; i < _config.length && space < 4; i++) {
			space += _config[i] && _config[i].extend ? 2 : 1;

			if (space <= 4) config.push(_config[i] || {});
		}

		while (plainEmpty && space++ < 4) config.push({});

		return config;
	}

	render() {
		const {
			style,
			id,
			blocks,
			editMode,
			onEditMode,
			deleteMode,
			onDeleteMode,
			onPressNewBlock,
		} = this.props;

		return (
			<BlockGrid
				style={style}
				id={id}
				blocks={this.getConfig(blocks)}
				blockStyle={{ marginBottom: 0 }}
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
			/>
		);
	}
}
