import React from 'react';
import {createStackNavigator} from "react-navigation";
import {CategoriesScreen} from "./Categories";
import {QuestionsScreen} from "./Questions";

export const FAQNavigator = createStackNavigator(
    {
        Categories: {
            screen: CategoriesScreen,
        },
        Questions: {
            screen: QuestionsScreen
        }
    },
    {
        initialRouteName: 'Categories',
    }
);
