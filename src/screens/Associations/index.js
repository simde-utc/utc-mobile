import React from 'react';
import {createStackNavigator} from "react-navigation";
import {ScrollView, Text, TouchableHighlight, View} from "react-native";
import styles from "../../styles";
import Icon from "../../components/Icon";
import Arrow from "../../img/icons/arrow_yellow.png";
import Portail from "../../services/Portail";

class AssociationBlock extends React.Component {
    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor={'#007383'} activeOpacity={0.7}>
                <View style={styles.navigation.fullWidthButton.view}>
                    <Text style={styles.navigation.fullWidthButton.text}>{this.props.entity.name}</Text>
                    <Icon style={{flex: 1}} image={Arrow}/>
                </View>
            </TouchableHighlight>
        );
    }
}

export class AssociationsListScreen extends React.Component {
    render() {
        const entities = this.props.entities;
        return (
            <ScrollView style={{backgroundColor: '#dedede'}}>
                {entities.map(asso => {
                    if (asso.children.length > 0)
                        return <AssociationBlock key={asso.name}
                                                 entity={asso}
                                                 onPress={() => {
                                                     //console.log(asso);
                                                     this.props.navigation.navigate('Truc')
                                                 }}/>;
                    else
                        return <Text>{asso.name}</Text>
                })}
            </ScrollView>
        )
    }
}

export class LoadingAssociationsScreen extends React.Component {

    static navigationOptions = {
        headerMode: 'float',
        headerTitle: 'Associations',
        headerStyle: {
            backgroundColor: '#007d94',
        },
        headerTintColor: "#fff"
    };

    constructor(props) {
        super(props);
        this.state = { poles: [] } // We stock all associations in this state
    }

    componentDidMount() {
        let poles = [];
        Portail.getAssos(true, 0, 2)
            .then(assos => {
                assos[0].children.forEach(entity => {
                    if (entity.children.length !== 0)
                        poles.push(entity)
                });
                this.setState({poles: poles});
            })
            .catch(reason => console.warn(reason))
    }

    render() {
        if (this.state.poles.length === 0)
            return <Text>Loading...</Text>
        else
            return <AssociationsListScreen entities={this.state.poles} navigation={this.props.navigation}/>

    }
}

export default Associations = createStackNavigator({
    LoadingAssociations: {
        screen: LoadingAssociationsScreen
    },
    AssociationsList: {
        screen: AssociationsListScreen
    }
},{
    initialRouteName: 'Loading'
})
