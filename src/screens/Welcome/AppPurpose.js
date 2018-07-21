import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';

import styles from '../../styles'
import HeaderView from '../../components/HeaderView';

const ForMember = () => (<Text>For Member</Text>)
const ForInterested = () => (<Text>For Interested</Text>)

// Tab Navigator
const PurposeTabs = createMaterialTopTabNavigator({
	Members: {
		screen: ForMember
	},
	Interested: {
		screen: ForInterested
	}
}, {
	// tabBarOptions: {
	// 	style: styles.tabbar,
	// 	indicatorStyle: styles.indicator,
	// 	labelStyle: styles.tablabel,
	// 	activeTintColor: '#222',
	// 	inactiveTintColor: '#222',
	// },
	// backBehavior: 'none',
	initialRouteName: 'Members',
	order: ['Members', 'Interested'],
});


export default class AppPurposeScreen extends React.Component {
	render() {
		return (
			<View style={styles.containerStretched}>
				<HeaderView
					flexSize={3}
					title="A quoi ça sert ?"
					subtitle="Cette application est destinée à la fois aux étudiants, aux enseignants et chercheurs, aux futurs étudiants ainsi qu'aux entreprises"
				/>
				<View style={{flex: 7}}>
					<PurposeTabs />
				</View>
			</View>
		);
	}
}