/*
 *
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license AGPL-3.0
 */


import React from 'react';
import { _, Notifications as n } from '../../utils/i18n';
import { FlatList, Text, View } from 'react-native';
import styles from '../../styles';
import ArticleComponent from '../../components/Articles/Article';
import PortailApi from '../../services/Portail';
import FakeItem from '../../components/FakeItem';
import Notification from '../../components/Notifications/Notification';

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
			notifications: []
		}
	}

	render() {
		const {notifications} = this.state;

		return (
			<FlatList
				style={styles.scrollable.list}
				data={notifications}
				renderItem={item => <Notification data={item}/>}
				ItemSeparatorComponent={() => <View style={styles.scrollable.sectionSeparator}/>}
				ListEmptyComponent={() => <FakeItem title={n('no_notifications')}/>}
			/>
		);
	}
}