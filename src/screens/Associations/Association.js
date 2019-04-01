import React from 'react';
import {Alert, ScrollView, Text} from "react-native";
import {createMaterialTopTabNavigator} from "react-navigation";
import Portail from "../../services/Portail";

class DetailsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            association: null
        }
    }

    componentDidMount() {
        const associationId = this.props.navigation.state.params.id;

        if (!Portail.isConnected())
            Alert.alert(
                "Association non disponible",
                "Le Portail des Associations est actuellement inaccessible.",
                [{text: 'OK', onPress: () => this.props.navigation.goBack(associationId)}]);


        Portail.getAssoDetails(associationId)
            .then(association => {
                this.setState({
                    association: association
                })
            })
            .catch(reason => {
                console.warn(reason);
                Alert.alert(
                    "Association non disponible",
                    "Une erreur est survenue lors de la récupération des informations.",
                    [{text: 'OK', onPress: () => this.props.navigation.goBack(associationId)}])
            })
    }

    render() {
        if (!this.state.association)
            return <Text>Loading...</Text>;
        else
            return (
                <ScrollView style={{
                    padding: '5%'
                }}>
                    <Text style={{
                        fontSize: 30,
                        fontWeight: 'bold'
                    }}>{this.state.association.shortname}</Text>
                    <Text style={{
                        fontSize: 15,
                        fontWeight: 'bold',
                        paddingBottom: 10
                    }}>{this.state.association.name}</Text>
                    <Text style={{
                        fontSize: 15,
                    }}>{this.state.association.description}</Text>
                </ScrollView>
            )
    }
}

class ArticlesView extends React.PureComponent {
    render() {
        return <Text>Articles</Text>
    }
}

class EventsView extends React.PureComponent {
    render() {
        return <Text>Events</Text>
    }
}

class MembersView extends React.PureComponent {
    render() {
        return <Text>Members</Text>
    }
}

const TopTabNavigator = createMaterialTopTabNavigator({
    Details: {
        screen: DetailsView
    },
    Articles: {
        screen: ArticlesView
    },
    Events: {
        screen: EventsView
    },
    Members: {
        screen: MembersView
    }
}, {
    initialRootName: 'Details',
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
