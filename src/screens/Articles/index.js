import { createStackNavigator } from 'react-navigation';
import ArticlesScreen from './Articles';
import fullArticle from './fullArticle';

export default createStackNavigator(
	{
		Articles: {
			screen: ArticlesScreen,
		},
		fullArticle: {
			screen: fullArticle,
		},
	},
	{
		initialRouteName: 'Articles',
	}
);
