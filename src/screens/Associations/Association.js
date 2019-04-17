import React from 'react';
import {createMaterialTopTabNavigator} from "react-navigation";
import {DetailsView} from "./Details";
import {ArticlesView} from "./Articles";
import {EventsView} from "./Events";
import {MembersView} from "./Members";

const TopTabNavigator = createMaterialTopTabNavigator({
    Details: {
        screen: DetailsView,
        navigationOptions: {
            title: 'En bref'
        }
    },
    Articles: {
        screen: ArticlesView,
        navigationOptions: {
            title: 'Articles'
        }
    },
    Events: {
        screen: EventsView,
        navigationOptions: {
            title: 'Évents'
        }
    },
    Members: {
        screen: MembersView,
        navigationOptions: {
            title: 'Trombi'
        }
    }
}, {
    tabBarOptions: {
        labelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#007383'
        },
        style: {
            backgroundColor: '#e7e7e7',
        },
    },
});

export default class AssociationScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: (typeof(navigation.state.params) !== 'undefined' && typeof(navigation.state.params.title) !== 'undefined') ?
            navigation.state.params.title : 'Association',
        headerStyle: {
            backgroundColor: '#007383'
        },
        headerTintColor: '#fff'
    });

    // This need to be added for sharing Navigation's properties with TopTabNavigator and its sub-components
    static router = TopTabNavigator.router;

    render() {
        return <TopTabNavigator navigation={this.props.navigation}/>
    }
}
