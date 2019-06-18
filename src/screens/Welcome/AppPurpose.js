import React from 'react';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import List from '../../components/List';

import styles from '../../styles';
import HeaderView from '../../components/HeaderView';

const endMessageStyle = styles.get('text.yellow', 'text.center', 'text.h4');

const forMembersData = [
	{
		icon: 'news',
		text: "Suivre et être notifié des actualités de l'UTC et de vos associations préférées",
	},
	{ icon: 'map', text: 'Se repérer dans le campus' },
	{
		icon: 'bell',
		text: "Etre notifié des résultats des examens et d'événements qui vous intéressent",
	},
	{
		icon: 'calendar',
		text: 'Consulter et synchroniser son agenda scolaire, associatif et personnel',
	},
];
const forInterestedData = [
	{ icon: 'news', text: "Suivre les actualités de l'UTC" },
	{ icon: 'map', text: 'Se repérer dans le campus' },
	{ icon: 'calendar', text: 'Consulter et synchroniser son agenda associatif et personnel' },
];

const ListData = data => <List data={data} />;

// Tab Navigator
const PurposeTabs = createMaterialTopTabNavigator(
	{
		Members: {
			screen: () => ListData(forMembersData),
			navigationOptions: () => ({
				title: 'Membre UTC',
			}),
		},
		Interested: {
			screen: () => ListData(forInterestedData),
			navigationOptions: () => ({
				title: 'Intéressé',
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
		<HeaderView
			style={{ flex: 3 }}
			title="A quoi ça sert ?"
			subtitle="En fonction de votre situation, vous pourrez découvrir quelques fonctionnalités de cette application. Elle est destinée aux associations, étudiants, personnels et enseignants de l'UTC, mais aussi aux entreprises et personnes interessées par l'UTC : entreprises, compiégnois."
		/>
		<View style={{ flex: 7, justifyContent: 'space-between', width: '100%' }}>
			<View style={{ flex: 6, marginLeft: 0 }}>
				<PurposeTabs />
			</View>
			<View style={bottomStyle}>
				<Text style={endMessageStyle}>
					Et bien d'autres fonctionnalités à découvrir dans l'application !
				</Text>
			</View>
		</View>
	</View>
);

export default AppPurposeScreen;
