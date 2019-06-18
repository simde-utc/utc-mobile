import React from 'react';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';

import List from '../../components/List';
import HeaderView from '../../components/HeaderView';
import styles from '../../styles';
import { _, Welcome as t } from '../../utils/i18n';

const endMessageStyle = styles.get('text.yellow', 'text.center', 'text.h4');

const forMembersData = [
	{
		icon: 'news',
		text: t('member_news'),
	},
	{
		icon: 'map',
		text: t('member_map'),
	},
	{
		icon: 'bell',
		text: t('member_notif'),
	},
	{
		icon: 'calendar',
		text: t('member_calendar'),
	},
];
const forInterestedData = [
	{ icon: 'news', text: t('interested_news') },
	{ icon: 'map', text: t('interested_map') },
	{ icon: 'calendar', text: t('interested_calendar') },
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

const bottomStyle = {
	flex: 2,
	justifyContent: 'center',
	paddingHorizontal: 15,
	marginBottom: '15%',
};

const AppPurposeScreen = () => (
	<View style={styles.container.default}>
		<HeaderView style={{ flex: 3 }} title={t('goal')} subtitle={t('goal_explanation')} />
		<View style={{ flex: 7, justifyContent: 'space-between' }}>
			<View style={{ flex: 6, marginLeft: 0 }}>
				<PurposeTabs />
			</View>
			<View style={bottomStyle}>
				<Text style={endMessageStyle}>{t('more_functionalities')}</Text>
			</View>
		</View>
	</View>
);

export default AppPurposeScreen;
