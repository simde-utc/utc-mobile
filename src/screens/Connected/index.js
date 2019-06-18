/**
 * Affiche la page connecté. Connecte l'application si l'application ne l'est pas ou qu'elle est lancée en tant qu'invité
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
 */

import React from 'react';
import { Text, View, Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import HeaderView from '../../components/HeaderView';
import BigButton from '../../components/BigButton';
import PortailApi from '../../services/Portail';
import styles from '../../styles';
import { _, e, Connected as t } from '../../utils/i18n';

export default class ConnectedScreen extends React.Component {
	static navigationOptions = {
		title: _('connected'),
		headerStyle: {
			display: 'none',
		},
	};

	constructor(props) {
		super(props);

		this.state = {
			loading: false,
		};

		if (PortailApi.isActive()) {
			this.state.subTitle = t('you_are_connected', { name: PortailApi.getUser().name });
			this.state.more = t('personnalize');
		} else this.state.subTitle = t('you_are_not_connected');

		if (!PortailApi.isConnected()) {
			this.state.loading = true;

			PortailApi.createInvitedAccount()
				.then(() => {
					this.setState(prevState => {
						prevState.loading = false;

						return prevState;
					});
				})
				.catch(() => {
					Alert.alert(_('registering'), e('registering_error'), [{ text: _('continue') }], {
						cancelable: false,
					});

					this.setState(prevState => {
						prevState.loading = false;

						return prevState;
					});
				});
		}
	}

	render() {
		const { navigation } = this.props;
		const { loading, subTitle, more } = this.state;
		const viewStyle = [styles.get('container.default', 'bg.white', 'pt.xl', 'pb.xxl'), { flex: 7 }];

		return (
			<View style={styles.container.default}>
				<View>
					<Spinner visible={loading} textContent={t('registering')} textStyle={{ color: '#FFF' }} />
				</View>
				<HeaderView title={`${_('welcome')} !`} subtitle={subTitle} />
				<View style={viewStyle}>
					<Text style={[styles.get('text.h2', 'text.center'), { margin: 20 }]}>
						{t('ready_to_use')} {more}!
					</Text>
					<BigButton
						label={t('go_home')}
						style={styles.mt.lg}
						onPress={() => navigation.navigate('App')}
					/>
				</View>
			</View>
		);
	}
}
