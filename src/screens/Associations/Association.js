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
            title: 'Évènements'
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
            color: '#fff'
        },
        style: {
            backgroundColor: '#007d94',
        },
    }
});

export default class AssociationScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: (typeof(navigation.state.params) !== 'undefined' && typeof(navigation.state.params.title) !== 'undefined') ?
            navigation.state.params.title : 'Association',
    });

    // This need to be added for sharing Navigation's properties with TopTabNavigator and its sub-components
    static router = TopTabNavigator.router;

    render() {
        return <TopTabNavigator navigation={this.props.navigation}/>
    }
}
