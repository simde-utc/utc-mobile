import React from "react";
import Portail from "../../services/Portail";
import {Alert, Image, ScrollView, Text, View} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

export class DetailsView extends React.PureComponent {
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

    componentWillUnmount() {
        if (Portail !== undefined)
            Portail.abortRequest();
    }

    render() {
        if (!this.state.association)
            return <Spinner visible={true}/>;
        else
            return (
                <ScrollView>
                    { this.state.association.image ?
                        <Image style={{height: 200, backgroundColor: "#fff"}} source={{uri: this.state.association.image}}/> : null
                    }
                    <View style={{
                        borderTopColor: '#fff',
                        borderTopWidth: 2,
                        padding: '5%'
                    }}>
                        <Text style={{
                            fontSize: 30,
                            fontWeight: 'bold',
                        }}>{this.state.association.shortname}</Text>
                        <Text style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            paddingBottom: 10,
                            color: '#6d6f71'
                        }}>{this.state.association.name}</Text>
                        /* TODO: Adapt to Markdown descriptions */
                        <Text style={{
                            fontSize: 15,
                            color: '#6d6f71'
                        }}>{this.state.association.description}</Text>
                    </View>
                </ScrollView>
            )
    }
}
