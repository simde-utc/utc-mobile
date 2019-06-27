/**
 * Affiche la page de connexion gérant l'interconnexion entre les comptes CAS et exté/app.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { View, TextInput, Alert } from 'react-native';
import Button from 'react-native-button';
import Spinner from 'react-native-loading-spinner-overlay';

import BigButton from '../../components/BigButton';
import HeaderView from '../../components/HeaderView';
import PortailApi from '../../services/Portail';
import CASAuth from '../../services/CASAuth';
import styles from '../../styles';
import { _, Connection as t } from '../../utils/i18n';

export default class ConnectionScreen extends React.Component {
	static navigationOptions = () => ({
		title: _('connection'),
		headerStyle: {
			display: 'none',
		},
	});

	constructor(props) {
		super(props);

		this.state = {
			emailOrLogin: '',
			password: '',
			allowEmail: false,
			loading: false,
			loadingText: t('connecting'),
		};
	}

	tryToConnect() {
		const { emailOrLogin, password, allowEmail } = this.state;

		if (emailOrLogin.length === 0 || password.length === 0) {
			Alert.alert(_('connection'), t('fill_all_inputs'), [{ text: _('continue') }], {
				cancelable: true,
			});
		} else if (emailOrLogin.includes('@') && !allowEmail) {
			this.setState(prevState => {
				prevState.allowEmail = true;

				return prevState;
			});

			Alert.alert(_('connection'), t('prefer_cas'), [{ text: _('continue') }], {
				cancelable: true,
			});
		} else {
			this.connect();
		}
	}

	connect() {
		const { emailOrLogin, password } = this.state;

		this.setState(prevState => {
			prevState.loading = true;

			return prevState;
		});

		return PortailApi.login(emailOrLogin, password)
			.then(() => {
				this.setState(prevState => {
					prevState.loadingText = t('registering');

					return prevState;
				});

				return PortailApi.createAppAuthentification()
					.then(() => {
						return this.register();
					})
					.catch(e => {
						console.warn(e);
						this.setState(prevState => {
							prevState.loading = false;

							return prevState;
						});

						Alert.alert(_('connection'), e('registering_error'), [{ text: _('continue') }], {
							cancelable: false,
						});
					});
			})
			.catch(e => {
				console.log(e);
				this.badLogin();
			});
	}

	register() {
		const { navigation } = this.props;
		const { emailOrLogin, password } = this.state;

		if (!emailOrLogin.includes('@')) {
			this.setState(prevState => {
				prevState.loadingText = t('registering_cas');

				return prevState;
			});

			return CASAuth.setData(emailOrLogin, password)
				.catch(e => {
					console.log(e);

					this.setState(prevState => {
						prevState.loading = false;

						return prevState;
					});

					Alert.alert(_('connection'), e('registering_cas_error'), [{ text: _('continue') }], {
						cancelable: false,
					});

					navigation.navigate('Connected');
				})
				.then(() => {
					this.setState(prevState => {
						prevState.loading = false;

						return prevState;
					});

					navigation.navigate('Connected');
				});
		}

		this.setState(prevState => {
			prevState.loading = false;

			return prevState;
		});

		navigation.navigate('Connected');
	}

	badLogin() {
		this.setState(prevState => {
			prevState.loading = false;

			return prevState;
		});

		Alert.alert(_('connection'), t('bad_login_password'), [{ text: _('continue') }], {
			cancelable: true,
		});
	}

	render() {
		const { navigation } = this.props;
		const { loading, loadingText, emailOrLogin, password } = this.state;
		const viewStyle = [styles.get('container.default', 'bg.white', 'pt.xl', 'pb.xxl'), { flex: 7 }];

		return (
			<View style={styles.container.default}>
				<View>
					<Spinner
						visible={loading}
						textContent={loadingText}
						textStyle={{ width: 250, textAlign: 'center', color: '#FFF' }}
					/>
				</View>
				<HeaderView title={_('login')} subtitle={t('simple_usage')} />
				<View style={viewStyle}>
					<TextInput
						style={styles.bigButton}
						underlineColorAndroid="transparent"
						placeholder={_('username')}
						value={emailOrLogin}
						onChangeText={text =>
							this.setState(() => {
								return { emailOrLogin: text };
							})
						}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<TextInput
						style={styles.bigButton}
						underlineColorAndroid="transparent"
						placeholder={_('password')}
						value={password}
						onChangeText={text =>
							this.setState(() => {
								return { password: text };
							})
						}
						autoCapitalize="none"
						autoCorrect={false}
						secureTextEntry
					/>
					<BigButton
						label={_('login')}
						style={styles.get('mt.lg', 'mb.md')}
						onPress={() => this.tryToConnect()}
					/>
				</View>
				<View style={{ position: 'absolute', bottom: 20, width: '90%' }}>
					<Button
						style={styles.get('text.lightBlue', 'text.h5')}
						onPress={() => navigation.navigate('Connected')}
					>
						{t('dont_login')}
					</Button>
				</View>
			</View>
		);
	}
}
