import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import List from '../../components/List';


import styles from '../../styles'
import HeaderView from '../../components/HeaderView';


const forMembersData = [
	{ icon: "news",			text: "Suivre et être notifié des actualités de vos associations préférées" },
	{ icon: "map",			text: "Se repérer dans le campus" },
	{ icon: "bell",			text: "Etre notifié des résultats des examens" },
	{ icon: "calendar",		text: "Consulter et synchroniser son agenda scolaire et associatif" },
]
const forInterestedData = [
	{ icon: "news",			text: "AAAAAAAAAAAh bon" },
	{ icon: "map",			text: "Se repérer dans le campus" },
	{ icon: "bell",			text: "Etre notifié des résultats des examens" },
	{ icon: "calendar",		text: "Consulter et synchroniser son agenda scolaire et associatif" },
]


// Tab Navigator
const PurposeTabs = createMaterialTopTabNavigator({
	Members: {
		screen: () => (<List data={ forMembersData } />)
	},
	Interested: {
		screen: () => (<List data={ forInterestedData } />)
	}
}, {
	tabBarOptions: {
		style: styles.tabBar.style,
		labelStyle: styles.tabBar.label,
	},
	backBehavior: 'none',
	initialRouteName: 'Members',
	order: ['Members', 'Interested'],
});

export default class AppPurposeScreen extends React.Component {
	render() {
		const endMessageStyle = styles.get('text.yellow', 'text.center', 'text.h4')
		return (
			<View style={styles.container.default}>
				<HeaderView
					style={{ flex: 3 }}
					title="A quoi ça sert ?"
					subtitle="Cette application est destinée à la fois aux étudiants, aux enseignant-chercheurs, aux futurs étudiants ainsi qu'aux entreprises et aux personnes interessées par l'UTC et ses associations"
				/>
				<View style={{ flex: 7, justifyContent: 'space-between' }}>
					<View style={{ flex: 6 }}>
						<PurposeTabs />
					</View>
					<View style={{ flex: 2, justifyContent: 'center', paddingHorizontal: 15, marginBottom: 40 }}>
						<Text style={ endMessageStyle }>
							Et bien d'autres fonctionnalités à découvrir dans l'application !
						</Text>
					</View>
				</View>
			</View>
		);
	}
}
