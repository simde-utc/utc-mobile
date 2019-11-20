import React from 'react';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';

import List from '../../components/List';
import styles from '../../styles';
import { _, Welcome as t } from '../../utils/i18n';

import NewsIcon from '../../img/icons/purpose/news.png';
import MapIcon from '../../img/icons/purpose/map.png';
import BellIcon from '../../img/icons/purpose/bell.png';
import CalendarIcon from '../../img/icons/purpose/calendar.png';

const endMessageStyle = styles.get('text.yellow', 'text.center', 'text.h4');

const forMembersData = [
	{ icon: NewsIcon, lazyText: 'screens.Welcome.member_news' },
	{ icon: MapIcon, lazyText: 'screens.Welcome.member_map' },
	{ icon: BellIcon, lazyText: 'screens.Welcome.member_notif' },
	{ icon: CalendarIcon, lazyText: 'screens.Welcome.member_calendar' },
];
const forInterestedData = [
	{ icon: NewsIcon, lazyText: 'screens.Welcome.interested_news' },
	{ icon: MapIcon, lazyText: 'screens.Welcome.interested_map' },
	{ icon: CalendarIcon, lazyText: 'screens.Welcome.interested_calendar' },
];

const ListData = data => <List data={data} />;

// Tab Navigator
const PurposeTabs = createMaterialTopTabNavigator(
	{
		Members: {
			screen: () => ListData(forMembersData),
			navigationOptions: () => ({
				title: _('utc_member'),
			}),
		},
		Interested: {
			screen: () => ListData(forInterestedData),
			navigationOptions: () => ({
				title: _('interested'),
			}),
		},
	},
	{
		tabBarOptions: {
			style: styles.tabBar.style,
			labelStyle: styles.tabBar.label,
		},
		backBehavior: 'none',
		initialRouteName: 'Members',
		order: ['Members', 'Interested'],
	}
);

const AppPurposeScreen = () => (
	<View style={styles.container.default}>
		<View style={{ flex: 1, justifyContent: 'flex-start', width: '100%' }}>
			<View style={{ flex: 1, marginLeft: 0 }}>
				<PurposeTabs />
			</View>
			<View style={{ flex: 0, marginBottom: 55 }}>
				<Text style={endMessageStyle}>{t('more_functionalities')}</Text>
			</View>
		</View>
	</View>
);

export default AppPurposeScreen;
