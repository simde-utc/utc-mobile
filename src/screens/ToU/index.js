/**
 * Affiche les CGUs dans la bonne langue.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { ScrollView, View } from 'react-native';

import BigButton from '../../components/BigButton';
import Preferences from '../../utils/Preferences';
import fr from './fr';
import { _ } from '../../utils/i18n';

const VALID_LANGS = { fr };

export default class ToU extends React.PureComponent {
	static navigationOptions = () => ({
		headerTitle: _('ToU'),
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	});

	static getToU() {
		let lang = Preferences.LANG;

		if (!Object.keys(VALID_LANGS).includes(lang)) {
			lang = fr;
		}

		const LangToU = VALID_LANGS[lang];

		return <LangToU />;
	}

	accept() {
		const { navigation } = this.props;

		if (Preferences.IS_UTC_BDE_MEMBER) {
			navigation.navigate('Connection');
		} else {
			navigation.navigate('Connected');
		}
	}

	render() {
		return (
			<ScrollView style={{
				backgroundColor: '#f4f4f4',
				paddingVertical: 10,
				paddingHorizontal: 15
			}}>
				<View>{ToU.getToU()}</View>
				<View style={{alignItems: 'center', paddingVertical: 10, marginBottom: 15}}>
					<BigButton label={_('accept')} onPress={() => this.accept()} />
				</View>
			</ScrollView>
		);
	}
}
