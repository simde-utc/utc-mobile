/*
 *
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license AGPL-3.0
 */

import React from 'react';
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
