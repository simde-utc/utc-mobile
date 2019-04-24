import React from "react";
import Portail from "../../services/Portail";
import {FlatList, Image, Text, View} from "react-native";
import styles from "../../styles";

class Member extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            role: null
        };
    }

    componentDidMount() {
        const roleId = this.props.member.pivot.role_id;

        Portail.getRole(roleId)
            .then(role => this.setState({role: role}))
            .catch(reason => {
                console.warn(reason);
            })
    }

    componentWillUnmount() {
        if (Portail !== undefined)
            Portail.abortRequest();
    }

    render() {
        return (
            <View style={styles.associations.block.view}>
                <Image style={{height: 75, width: 75}}
                       source={{uri: this.props.member.image}}
                       resizeMode='cover'/>

                <View style={styles.associations.block.details}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#3c3746'}}>{this.props.member.name}</Text>
                    {this.state.role ? <Text style={{fontSize: 13}}>{this.state.role.name}</Text> : null}
                </View>
            </View>
        )
    }
}

class FakeMember extends React.PureComponent {
    render() {
        return (
            <View style={styles.associations.block.view}>
                <Image style={{height: 75, width: 75, backgroundColor: '#f1f1f1'}}
                       source={require('../../img/icons/picture.png')}
                       resizeMode='center'/>

                <View style={styles.associations.block.details}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: 'lightgray'}}>{this.props.title}</Text>
                </View>
            </View>
        )
    }
}

export class MembersView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            loading: true
        };
    }

    componentDidMount() {
        const associationId = this.props.navigation.state.params.id;

        Portail.getAssoMembers(associationId)
            .then(members =>
                this.setState({
                    members: members.sort((a, b) => a.name.localeCompare(b.name)),
                    loading: false
                }))
            .catch(reason => {
                console.warn(reason);
                this.setState({loading: false})
            })
    }

    componentWillUnmount() {
        if (Portail !== undefined)
            Portail.abortRequest();
    }

    render() {
        return <FlatList style={styles.associations.list}
                         data={this.state.members.map(member => {return {key: member.id, member: member}})}
                         renderItem={({item}) => { return (
                             <View style={{flex: 1, flexDirection: 'column'}}>
                                 <Member member={item.member}/>
                             </View>
                         )}}
                         ItemSeparatorComponent={() => <View style={styles.associations.separator} />}
                         ListEmptyComponent={() => <FakeMember title={'Aucun membre trouvé'}/>}/>
    }
}
