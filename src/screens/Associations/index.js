import React from 'react';
import {Alert, FlatList, Image, Text, TouchableHighlight, View} from "react-native";
import Portail from "../../services/Portail";
import withNavigation from "react-navigation/src/views/withNavigation";
import styles from "../../styles";
import SegmentedControlTab from "react-native-segmented-control-tab";
import Icon from "../../components/Icon";

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
            <Image style={{height: height, width: width, backgroundColor: '#f1f1f1'}}
                   source={require('../../img/icons/picture.png')}
                   resizeMode='center'/>
    }

    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress}>
                <View style={styles.associations.block.view}>
                    { this._renderLogo() }
                    <View style={styles.associations.block.details}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: this._getPoleColor()}}>{this.props.entity.shortname}</Text>
                        <Text style={{fontSize: 13, fontWeight: 'bold', color: '#6d6f71'}}>{this.props.entity.name}</Text>
                    </View>
                    <View>
                        <Icon image={require('../../img/icons/arrow_yellow.png')}/>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

class FakeAssociationBlock extends React.PureComponent {
    render() {
        return (
            <View style={styles.associations.block.view}>
                <Image style={{height: 100, width: 100, backgroundColor: '#f1f1f1'}}
                       source={require('../../img/icons/picture.png')}
                       resizeMode='center'/>
                <View style={styles.associations.block.details}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: '#f1f1f1'}}>{this.props.title || ''}</Text>
                    <Text style={{fontSize: 13, fontWeight: 'bold', color: '#f1f1f1'}}>{this.props.subtitle || ''}</Text>
                </View>
            </View>
        );
    }
}

export class AssociationsListScreen extends React.PureComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Associations',
            headerStyle: {
                backgroundColor: '#fff',
            },
            headerTintColor: '#007383'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            entities: [],
            filteredEntities: [],
            filters: ['Toutes', 'PAE', 'PTE', 'PVDC', 'PSEC', 'BDE-UTC'],
            selectedFilterIndex: 0,
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
        this.setState({selectedFilterIndex: index});

        if (index === 0) // "All" filter
            this.setState({filteredEntities: this.state.entities});
        else if (index > 0 && index < this.state.filters.length) // Pôles filters
            this.setState({
                filteredEntities: this.state.entities.filter(entity => entity.parent != null && entity.parent.shortname === this.state.filters[index]),
            });
        else
            throw 'Wrong filter index';

        // Scroll to the first of the FlatList
        this.refs._associationsFlatList.scrollToOffset({ animated: true, offset: 0 });
    }

    _renderFilters() {
        return (
            <View style={{padding: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f1f1'}}>
                <SegmentedControlTab
                    tabStyle={{backgroundColor: 'transparent', borderColor: '#007383'}}
                    tabTextStyle={{color: '#007383'}}
                    activeTabStyle={{backgroundColor: '#007383'}}
                    values={this.state.filters}
                    selectedIndex={this.state.selectedFilterIndex}
                    onTabPress={(index) => this._filterByPoles(index)}/>
            </View>
        )
    }

    _renderEmptyBlock() {
        return <FakeAssociationBlock/>
    }

    render() {
        return (
            <FlatList
                style={styles.associations.list}
                ref='_associationsFlatList'
                data={this.state.filteredEntities.map(entity => { return {key: entity.id, entity: entity}})}
                renderItem={({item}) => <AssociationBlock entity={item.entity}
                                                          onPress={() => { this.props.navigation.navigate({
                                                              key: item.key,
                                                              routeName: 'Association',
                                                              params: {
                                                                  id: item.entity.id,
                                                                  title: item.entity.shortname}})}}/>}
                ListHeaderComponent={this._renderFilters()}
                ItemSeparatorComponent={() => <View style={styles.associations.separator} />}
                ListEmptyComponent={() => <FakeAssociationBlock title={'Chargement...'}/>}
            />
        )
    }
}

export default withNavigation(AssociationsListScreen);
