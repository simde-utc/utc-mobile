import React from 'react';
import { Alert, View, ScrollView, Text } from 'react-native';

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
		const subsubtitleStyle = styles.get('text.lightGray', 'text.h5', 'text.center', 'mb.xs');

		return (
			<View style={container.default}>
				<ScrollView
					style={styles.get('mt.xs', 'mb.xs'), { flex: 1, width: '100%', marginBottom: 60 }}
					contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}
				>
					<Text style={subsubtitleStyle}>{t('choose_features')}</Text>
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
					<BigButton
						label={_('confirm')}
						onPress={this.validate.bind(this)}
						style={{ marginTop: 15 }}
					/>
				</ScrollView>
			</View>
		);
	}
}
