import React from 'react';
import { FlatList } from 'react-native';

import Shortcut from './Shortcut';
import Preferences from '../../utils/Preferences';
import styles from '../../styles';

export default class ShortcutGrid extends React.Component {
	renderShortcut({ type, data }) {
		const { navigation } = this.props;

		let ShortcutType;

		switch (type) {
			case 'blank':
				ShortcutType = Shortcut;
				break;

			case 'shortcut':
			default:
				ShortcutType = Shortcut;
				break;
		}

		return <ShortcutType {...(data || {})} navigation={navigation} />;
	}

	render() {
		return (
			<FlatList
				data={Preferences.USER_SHORTCUTS}
				keyExtractor={shortcut => shortcut.id}
				renderItem={({ item }) => this.renderShortcut(item)}
				style={styles.shortcut.gridView}
				numColumns={2}
			/>
		);
	}
}
