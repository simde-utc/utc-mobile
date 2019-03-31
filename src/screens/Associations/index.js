import React from 'react';
import {FlatList, Image, Text, TouchableHighlight, View} from "react-native";
import Icon from "../../components/Icon";
import Arrow from "../../img/icons/arrow_yellow.png";
import Portail from "../../services/Portail";
import withNavigation from "react-navigation/src/views/withNavigation";
import Spinner from "react-native-loading-spinner-overlay";

class PoleBlock extends React.Component {
    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor={'#fff'} activeOpacity={0.7}>
                <View style={{
                    backgroundColor: '#f2f2f2',
                    margin: "5%",
                    marginBottom: 0,

                    flex: 1,
                    flexDirection: 'column',

                    borderColor: '#fff',
                    borderWidth: 2,
                    borderRadius: 2
                }}>
                    <View style={{
                        borderBottomWidth: 2,
                        borderBottomColor: '#fff'}}>
                        { this.props.entity.image ? <Image style={{
                            height: 100,
                            width: '100%',
                            backgroundColor: "#fff"
                        }} source={{uri: this.props.entity.image}}/> : null }
                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: "5%",
                        paddingTop: 0
                    }}>
                        <View>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: 'gray'
                            }}>{this.props.entity.shortname}</Text>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                color: 'gray'
                            }}>{this.props.entity.name}</Text>
                        </View>
                        <Icon image={Arrow} style={{}}/>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

class AssociationBlock extends React.Component {
    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor={'#fff'} activeOpacity={0.7}>
                <View style={{
                    backgroundColor: '#f2f2f2',
                    margin: "5%",
                    marginBottom: 0,

                    flex: 1,
                    flexDirection: 'column',

                    borderColor: '#fff',
                    borderWidth: 2,
                    borderRadius: 2
                }}>
                    <View style={{
                        borderBottomWidth: 2,
                        borderBottomColor: '#fff'}}>
                        { this.props.entity.image ? <Image style={{
                            height: 100,
                            width: '100%',
                            backgroundColor: "#fff"
                        }} source={{uri: this.props.entity.image}}/> : null }
                    </View>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: "5%",
                        paddingTop: 0
                    }}>
                        <View style={{
                        }}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: 'gray'
                            }}>{this.props.entity.shortname}</Text>
                            <Text style={{
                                fontSize: 15,
                                fontWeight: 'bold',
                                color: 'gray'
                            }}>{this.props.entity.name}</Text>
                        </View>
                        <Icon image={Arrow} style={{}}/>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

export class AssociationsListScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: (typeof(navigation.state.params) !== 'undefined' && typeof(navigation.state.params.title) !== 'undefined') ?
            navigation.state.params.title : 'Associations',
    });

    constructor(props) {
        super(props);
        this.state = {
            entities: this.props.navigation.getParam('entities') || []
        }
    }

    componentDidMount() {
        // If we didn't pass any entity, we load them from Portail API
        if (this.state.entities.length === 0) {
            let entities = [];

            Portail.getAssos(true, 0, 2)
                .then(assos => {
                    assos[0].children.forEach(entity => {
                        if (entity.children.length !== 0)
                            entities.push(entity)
                    });
                    this.setState({entities: entities});
                })
                .catch(reason => console.warn(reason))
        }
    }

    render() {
        if (this.state.entities.length === 0)
            return <Spinner/>;
        else
            return (
                <FlatList
                    style={{backgroundColor: '#f8f8f8', paddingBottom: '5%'}}
                    data={this.state.entities.map(entity => {return {key: entity.id, entity: entity}})}
                    renderItem={({item}) => {
                        if (item.entity.children.length > 0)
                            return <PoleBlock entity={item.entity}
                                              onPress={() => {
                                                  this.props.navigation.navigate({
                                                      key: item.key,
                                                      routeName: 'Associations',
                                                      params: {entities: item.entity.children, title: item.entity.name}})
                                              }}/>;
                        else
                            return <AssociationBlock entity={item.entity}/>;
                    }}
                />
            )
    }
}

export default withNavigation(AssociationsListScreen);
