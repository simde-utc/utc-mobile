/**
 * Affiche toutes les notifications.
 *
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Alert, FlatList, View, ScrollView } from 'react-native';
import { _, e, Notifications as t } from '../../utils/i18n';
import styles from '../../styles';
import FakeItem from '../../components/FakeItem';
import Notification from '../../components/Notifications/Notification';
import PortailApi from '../../services/Portail';

export default class NotificationsScreen extends React.PureComponent {
	static navigationOptions = () => ({
		headerTitle: _('notifications'),
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	});

	constructor(props) {
		super(props);

		this.state = {
			notifications: [],
			loading: true,
		};
	}

	componentDidMount() {
		this.getNotifications();
	}

	getNotifications() {
		const { navigation } = this.props;

		PortailApi.getUserNotifications()
			.then(notifications => this.setState({ notifications, loading: false }))
			.catch(reason => {
				console.warn(reason);
				Alert.alert(e('associations_not_available'), e('get_association_error'), [
					{ text: _('ok'), onPress: () => navigation.goBack() },
				]);
			});
	}

	render() {
		const { navigation } = this.props;
		const { loading, notifications } = this.state;

		if (loading)
			return (
				<ScrollView style={styles.scrollable.list}>
					<FakeItem title={_('loading')} />
				</ScrollView>
			);

		return (
			<FlatList
				style={styles.scrollable.list}
				data={notifications}
				keyExtractor={item => item.id}
				renderItem={item => <Notification {...item.item} navigation={navigation} />}
				ItemSeparatorComponent={() => <View style={styles.scrollable.sectionSeparator} />}
				ListEmptyComponent={() => <FakeItem title={t('no_notifications')} />}
			/>
		);
	}
}
