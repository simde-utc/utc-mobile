import React from 'react';
import { FlatList } from 'react-native';

import Shortcut from './Shortcut';
import BlankShortcut from './BlankShortcut';
import PayUTCShortcut from './PayUTCShortcut';
import AssociationShortcut from './AssociationShortcut';
import Preferences from '../../utils/Preferences';
import styles from '../../styles';

export default class ShortcutGrid extends React.Component {
	static getShortcuts() {
		const shortcuts = Preferences.USER_SHORTCUTS.slice();

		if (Preferences.USER_SHORTCUTS.length % 2 === 1) {
			shortcuts.push({
				type: 'blank',
			});
		}

		for (const key in shortcuts) {
			shortcuts[key].id = key;
		}

		return shortcuts;
	}

	renderShortcut({ type, data }) {
		const { navigation } = this.props;

		let ShortcutType;

		switch (type) {
			case 'blank':
				ShortcutType = BlankShortcut;
				break;

			case 'association':
				ShortcutType = AssociationShortcut;
				break;

			case 'payutc':
				ShortcutType = PayUTCShortcut;
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
				data={ShortcutGrid.getShortcuts()}
				keyExtractor={shortcut => shortcut.id}
				renderItem={({ item }) => this.renderShortcut(item)}
				style={styles.shortcut.gridView}
				numColumns={2}
			/>
		);
	}
}
