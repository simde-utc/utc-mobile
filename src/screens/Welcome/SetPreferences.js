import React from 'react';
import { Alert, View, ScrollView } from 'react-native';

import HeaderView from '../../components/HeaderView';
import BigCheckBox from '../../components/BigCheckBox';
import BigButton from '../../components/BigButton';
import styles from '../../styles';
import Preferences from '../../utils/Preferences';
import { _, Welcome as t } from '../../utils/i18n';

export default class SetPreferencesScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			checked: {
				SHOW_UTC_ACTUALITIES: Preferences.SHOW_UTC_ACTUALITIES,
				SHOW_ASSOS_ACTUALITIES: Preferences.SHOW_ASSOS_ACTUALITIES,
				IS_UTC_BDE_MEMBER: Preferences.IS_UTC_BDE_MEMBER,
			},
		};

		this.toggleCheck = this.toggleCheck.bind(this);
	}

	toggleCheck(key, force = null) {
		return this.setState(prevState => ({
			...prevState,
			checked: {
				...prevState.checked,
				[key]: force == null ? !prevState.checked[key] : force,
			},
		}));
	}

	validate() {
		const { checked } = this.state;
		const { navigation } = this.props;

		for (const key in checked) {
			Preferences[key] = checked[key];
		}

		navigation.navigate('ToU');
	}

	render() {
		const { checked } = this.state;
		const { container, text, mt } = styles;

		return (
			<View style={container.default}>
				<HeaderView title={t('learn_more')} style={{flex: 1}} subtitle={t('allow_param')} />
				<ScrollView
					style={styles.get('mt.xs', 'mb.xs'), { flex: 1, width: '100%' }}
					contentContainerStyle={{ alignItems: 'center', justifyContent: 'space-evenly', flexGrow: 1 }}
				>
					<BigCheckBox
						checked={checked.SHOW_UTC_ACTUALITIES}
						labelStyle={text.h5}
						label={t('show_utc')}
						onPress={() => this.toggleCheck('SHOW_UTC_ACTUALITIES')}
					/>
					<BigCheckBox
						checked={checked.SHOW_ASSOS_ACTUALITIES}
						labelStyle={text.h5}
						label={t('show_assos')}
						onPress={() => this.toggleCheck('SHOW_ASSOS_ACTUALITIES')}
					/>
					<BigCheckBox
						checked={checked.IS_UTC_BDE_MEMBER}
						labelStyle={text.h5}
						label={t('utc_member')}
						onPress={() =>
							Alert.alert(
								'Mode de connexion',
								"La connexion extérieure n'est pas disponible pour la Beta"
							)
						}
					/>
				</ScrollView>
				{/*Permet d'avoir une taille fixe de 115px pour le bouton et l'espace avec les bulles*/ }
				<View style={{ flex: 0,	flexBasis: 115 }}>
					<BigButton label={_('confirm')} onPress={this.validate.bind(this)} />
				</View>
			</View>
		);
	}
}
