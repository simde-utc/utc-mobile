import { StackActions, NavigationActions } from 'react-navigation';

export const resetNavigation = function (navigation, route) {
    navigation.dispatch(StackActions.reset({
    	index: 0,
    	actions: [NavigationActions.navigate({ routeName: route || "Home" })],
    }))

    return navigation
}

const navigation = {
    resetNavigation: resetNavigation
}

export default navigation
