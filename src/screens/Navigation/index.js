import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { ScrollView, Text, TouchableHighlight, View } from 'react-native';
import AssosScreen from '../Assos/Assos';
import ProfileScreen from '../Profile';
import Icon from '../../components/Icon';
import Arrow from '../../img/icons/arrow_yellow.png';
import styles from '../../styles';
import ProfileHeader from '../Profile/ProfileHeader';

export const FullWidthButton = ({ onPress, name }) => (
	<TouchableHighlight onPress={onPress} underlayColor="#007383" activeOpacity={0.7}>
		<View style={styles.navigation.fullWidthButton.view}>
			<Text style={styles.navigation.fullWidthButton.text}>{name}</Text>
			<Icon style={{ flex: 1 }} image={Arrow} />
		</View>
	</TouchableHighlight>
);

export const ListScreen = ({ navigation }) => (
	<ScrollView style={styles.navigation.scrollView}>
		<ProfileHeader onPress={() => navigation.navigate('Profile')} />
		<FullWidthButton name="Mon compte" onPress={() => navigation.navigate('Profile')} />
		<FullWidthButton name="Liste des associations" onPress={() => navigation.navigate('Assos')} />
	</ScrollView>
);

const NavigationNavigator = createStackNavigator(
	{
		Navigation: {
			screen: ListScreen,
			navigationOptions: {
				header: null,
			},
		},
		Assos: {
			screen: AssosScreen,
			navigationOptions: {
				headerTitle: 'Associations',
			},
		},
		Profile: {
			screen: ProfileScreen,
		},
	},
	{
		initialRouteName: 'Navigation',
	}
);

export default NavigationNavigator;
