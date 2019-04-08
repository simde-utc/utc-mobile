import React from "react";
import Portail from "../../services/Portail";
import {Alert, FlatList, Image, Text, View} from "react-native";

class Member extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            role: null
        }
    }

    componentDidMount() {
        const roleId = this.props.member.pivot.role_id;

        Portail.getRole(roleId)
            .then(role => this.setState({role: role}))
            .catch(reason => {
                console.warn(reason);
            })
    }

    render() {
        return (
            <View style={{
                margin: '5%',
                backgroundColor: "#f2f2f2",
                borderColor: '#fff',
                borderWidth: 2,
            }}>
                <View style={{
                    borderBottomWidth: 2,
                    borderBottomColor: '#fff'
                }}><Image style={{
                    height: 200,
                    width: "100%"
                }}
                          source={{uri: this.props.member.image}}/></View>
                <View style={{margin: 10}}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold'
                    }}>{this.props.member.name}</Text>

                    {
                        this.state.role ? <Text style={{
                            fontSize: 13
                        }}>{this.state.role.name}</Text> : null
                    }

                </View>
            </View>
        )
    }
}

export class MembersView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            members: []
        }
    }

    componentDidMount() {
        const associationId = this.props.navigation.state.params.id;

        Portail.getAssoMembers(associationId)
            .then(members => this.setState({members: members}))
            .catch(reason => {
                console.warn(reason);
                Alert.alert(
                    "Trombinoscope non disponible",
                    "Une erreur est survenue lors de la récupération des membres de l'association.",
                    [{text: 'OK', onPress: () => this.props.navigation.goBack(associationId)}])
            })
    }

    componentWillUnmount() {
        if (Portail !== undefined)
            Portail.abortRequest();
    }

    render() {
        if (this.state.members.length === 0)
            return <Text>Loading...</Text>;
        else
            return <FlatList
                data={this.state.members.map(member => {return {key: member.id, member: member}})}
                renderItem={({item}) => { return (
                    <View style={{ flex: 1, flexDirection: 'column'}}>
                        <Member member={item.member}/>
                    </View>
                )}}
                numColumns={2}
                keyExtractor={(item, index) => index}
            />
    }
}
