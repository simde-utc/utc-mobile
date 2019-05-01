import React from 'react';
import {createMaterialTopTabNavigator} from "react-navigation";
import {DetailsView} from "./Details";
import {ArticlesView} from "./Articles";
import {EventsView} from "./Events";
import {MembersView} from "./Members";

const TopTabNavigator = createMaterialTopTabNavigator({
    AssociationDetails: {
        screen: DetailsView,
        navigationOptions: {
            title: 'En bref'
        }
    },
    AssociationArticles: {
        screen: ArticlesView,
        navigationOptions: {
            title: 'Articles'
        }
    },
    AssociationEvents: {
        screen: EventsView,
        navigationOptions: {
            title: 'Évents'
        }
    },
    AssociationMembers: {
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
            backgroundColor: '#fff',
        },
    },
});

export default class AssociationScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: (typeof(navigation.state.params) !== 'undefined' && typeof(navigation.state.params.title) !== 'undefined') ?
            navigation.state.params.title : 'Association',
        headerStyle: {
            backgroundColor: '#fff'
        },
        headerTintColor: '#007383',
        headerForceInset: { top: 'never' }
    });

    // This need to be added for sharing Navigation's properties with TopTabNavigator and its sub-components
    static router = TopTabNavigator.router;

    render() {
        return <TopTabNavigator navigation={this.props.navigation}/>
    }
}
