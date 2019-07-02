import { createStackNavigator } from 'react-navigation';

import EventsScreen from './Events';
import EventScreen from './Event';

export default createStackNavigator(
	{
		Events: {
			screen: EventsScreen,
		},
		Event: {
			screen: EventScreen,
			navigationOptions: ({ navigation }) => ({
				title: navigation.state.params.name,
			}),
		},
	},
	{
		initialRouteName: 'Events',
	}
);
