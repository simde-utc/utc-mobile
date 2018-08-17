import { createStackNavigator } from 'react-navigation';

import AssosScreen from './Assos';
import AssoScreen from './Asso';

export default Assos = createStackNavigator(
{
	Assos: {
		screen: AssosScreen,
	},
	Asso: {
		screen: AssoScreen,
		navigationOptions: ({ navigation }) => ({
			title: navigation.state.params.name,
		}),
	}
},
{
	initialRouteName: 'Assos',
});
