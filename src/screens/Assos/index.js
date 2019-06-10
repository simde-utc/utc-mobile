import { createStackNavigator } from 'react-navigation';
import { Text } from 'react-native';

import AssosScreen from './Assos';
import AssoScreen from './Asso';

export default createStackNavigator(
	{
		Assos: {
			screen: AssosScreen,
		},
		Asso: {
			screen: AssoScreen,
			navigationOptions: ({ navigation }) => {
				return {
					title: navigation.state.params.name,
					headerTitle: <Text adjustsFontSizeToFit>{navigation.state.params.name}</Text>,
				};
			},
		},
	},
	{
		initialRouteName: 'Assos',
	}
);
