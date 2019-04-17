import React from 'react';
import {Alert, FlatList, Image, SegmentedControlIOS, Text, TouchableHighlight, View} from "react-native";
import Portail from "../../services/Portail";
import withNavigation from "react-navigation/src/views/withNavigation";
import Spinner from "react-native-loading-spinner-overlay";
import styles from "../../styles";
import Button from "react-native-button";

class AssociationBlock extends React.PureComponent {
    /**
     * Returns the color of the Association's Pole
     * @returns {string}
     * @private
     */
    _getPoleColor() {
        if (this.props.entity.parent == null)
            return '#000';

        switch (this.props.entity.parent.shortname) {
            case 'PAE': return '#f27941';
            case 'PTE': return '#1dafec';
            case 'PVDC': return '#fed43b';
            case 'PSEC': return '#8ec449';
            case 'BDE-UTC': return '#3c3746';
            default: return '#000';
        }
    }

    /**
     * Renders association's logo or a default image
     * @returns {*}
     * @private
     */
    _renderLogo() {
        const height = 100, width = 100;

        return this.props.entity.image ?
            <Image style={{height: height, width: width, backgroundColor: '#fff'}}
                   source={{uri: this.props.entity.image}}
                   resizeMode='contain'/>
            :
            <Image style={{height: height, width: width}}
                   source={require('../../img/icons/picture.png')}
                   resizeMode='center'/>
    }

    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor={'#fff'} activeOpacity={0.7}>
                <View style={styles.associations.block.view}>
                    { this._renderLogo() }
                    <View style={styles.associations.block.details}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: this._getPoleColor()}}>{this.props.entity.shortname}</Text>
                        <Text style={{fontSize: 13, fontWeight: 'bold', color: '#6d6f71'}}>{this.props.entity.name}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

export class AssociationsListScreen extends React.PureComponent {
    static navigationOptions = {
        headerTitle: 'Associations',
        headerStyle: {
            backgroundColor: '#007383',
        },
        headerTintColor: '#fff'
    };

    constructor(props) {
        super(props);
        this.state = {
            entities: [],
            filters: ['Toutes', 'PAE', 'PTE', 'PVDC', 'PSEC', 'BDE-UTC']
        }
    }

    componentDidMount() {
        if (!Portail.isConnected()) {
            this.props.navigation.goBack();
            Alert.alert('Association non disponible', 'Le Portail des Associations est actuellement inaccessible.')
        }

        let entities = [];

        Portail.getAssos(true, 0, 2)
            .then(assos => {
                entities.push(assos[0]); // BDE

                // We add BDE's sons and their sons too
                assos[0].children.forEach(entity => {
                    entities.push(entity);
                    entity.children.forEach(asso => entities.push(asso));
                });

                this.setState({
                    entities: entities.sort((a, b) => a.shortname.localeCompare(b.shortname)), // We return entities in alphabetical order
                    filteredEntities: entities,
                });
            })
            .catch(reason => {
                console.warn(reason);
                Alert.alert(
                    'Associations non disponibles',
                    'Une erreur est survenue lors de la récupération des associations.',
                    [{text: 'OK', onPress: () => this.props.navigation.goBack()}])
            })
    }

    componentWillUnmount() {
        if (Portail !== undefined)
            Portail.abortRequest();
    }

    _filterByPoles(index) {
        if (index === 0) // "All" filter
            this.setState({filteredEntities: this.state.entities});
        else if (index > 0 && index < this.state.filters.length) // Pôles filters
            this.setState({
                filteredEntities: this.state.entities.filter(entity => entity.parent != null && entity.parent.shortname === this.state.filters[index])
            });
        else
            throw 'Wrong filter index';

        // Scroll to the first of the FlatList
        this.refs._associationsFlatList.scrollToOffset({ animated: true, offset: 0 });
    }

    render() {
        if (this.state.entities.length === 0)
            return <Spinner visible={true}/>;
        else
            return (
                <View style={styles.associations.layout}>
                    <SegmentedControlIOS
                        style={{margin: 10}}
                        tintColor={'#007383'}
                        values={this.state.filters}
                        selectedIndex={0}
                        onChange={(event) => this._filterByPoles(event.nativeEvent.selectedSegmentIndex)}/>
                    <FlatList
                        ref='_associationsFlatList'
                        data={this.state.filteredEntities.map(entity => { return {key: entity.id, entity: entity}})}
                        renderItem={({item}) => <AssociationBlock entity={item.entity}
                                                                  onPress={() => { this.props.navigation.navigate({
                                                                      key: item.key,
                                                                      routeName: 'Association',
                                                                      params: {
                                                                          id: item.entity.id,
                                                                          title: item.entity.shortname}})}}/>
                        }
                    />
                </View>
            )
    }
}

export default withNavigation(AssociationsListScreen);
