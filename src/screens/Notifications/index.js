/**
 * Défini les différentes routes pour les notifications.
 *
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import { createStackNavigator } from 'react-navigation';
import NotificationsScreen from './NotificationsScreen';

export default createStackNavigator(
	{
		Notifications: {
			screen: NotificationsScreen,
		},
	},
	{
		initialRouteName: 'Notifications',
	}
);
