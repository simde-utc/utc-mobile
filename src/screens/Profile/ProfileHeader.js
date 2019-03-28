import React from "react";
import CASAuth from "../../services/CASAuth";
import PortailApi from "../../services/Portail";
import {Image, Text, TouchableHighlight, View} from "react-native";
import styles from "../../styles"

export class ProfileHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login: ''
        };

        if (CASAuth.isConnected()) {
            CASAuth.getLogin().then((login) => {
                this.setState((prevState) => {
                    prevState.login = login;
                    return prevState
                })
            })
        }
    }

    render() {
        const imagePath = CASAuth.isConnected() ? { uri: 'https://demeter.utc.fr/portal/pls/portal30/portal30.get_photo_utilisateur?username=' + this.state.login } : require('../../img/icon.png');
        const fullName = PortailApi.getUser().name;

        // TODO: prévoir le cas lorsque l'utilisateur n'est pas connecté

        return (
            <TouchableHighlight onPress={this.props.onPress}>
                <View style={styles.userProfile.view}>
                    <Image style={styles.userProfile.image} source={imagePath}/>
                    <Text style={styles.userProfile.name}>{fullName}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}