import React from "react";
import Portail from "../../services/Portail";
import {Alert, Image, ScrollView, Text, View} from "react-native";
import styles from "../../styles";

export class DetailsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            association: null,
            loading: true
        };
    }

    componentDidMount() {
        const associationId = this.props.navigation.state.params.id;

        if (!Portail.isConnected()) {
            this.props.navigation.goBack(associationId);
            Alert.alert('Association non disponible', 'Le Portail des Associations est actuellement inaccessible.')
        }

        Portail.getAssoDetails(associationId)
            .then(association => {
                this.setState({
                    association: association,
                    loading: false
                })
            })
            .catch(reason => {
                console.log(reason);
                this.props.navigation.goBack(associationId);
                Alert.alert('Association non disponible', 'Une erreur est survenue lors de la récupération des informations.');
                this.setState({loading: false})
            })
    }

    componentWillUnmount() {
        if (Portail !== undefined)
            Portail.abortRequest();
    }

    _renderLogo() {
        if (!this.state.association.image)
            return null;

        return (
            <View style={styles.associations.details.logoView}>
                <Image style={{height: 200, width: 200}}
                       source={{uri: this.state.association.image}}
                       resizeMode='contain'/>
            </View>
        );
    }

    render() {
        if (this.state.loading)
            return <Text>loading...</Text>;
        else if (this.state.association)
            return (
                <ScrollView>
                    { this._renderLogo() }
                    <View style={{padding: '5%'}}>
                        <Text style={styles.associations.details.textView.title}>{this.state.association.shortname}</Text>
                        <Text style={styles.associations.details.textView.subtitle}>{this.state.association.name}</Text>
                        <Text style={styles.associations.details.textView.description}>{this.state.association.description}</Text>
                    </View>
                </ScrollView>
            );
        else return null;
    }
}
