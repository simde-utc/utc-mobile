import { createStackNavigator } from 'react-navigation';
import React from 'react';
import {Text} from 'react-native';

import ArticlesScreen from './Articles';
import fullArticle from './fullArticle';

export default Assos = createStackNavigator(
{
	Articles: {
		screen: ArticlesScreen,
	},
	fullArticle: {
		screen: fullArticle,
	}
},
{
	initialRouteName: 'Articles',
});
