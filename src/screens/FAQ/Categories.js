import React from "react";
import {Alert, FlatList, ScrollView, Text, TouchableHighlight, View} from "react-native";
import Icon from "../../components/Icon";
import Portail from "../../services/Portail";
import styles from "../../styles";

class Category extends React.PureComponent {
    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress}>
                <View style={{
                    padding: 10,
                    backgroundColor: '#fff',
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{this.props.category.name}</Text>
                    </View>
                    <View>
                        <Icon image={require('../../img/icons/arrow_yellow.png')}/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

class FakeCategory extends React.PureComponent {
    render() {
        return (
            <View style={{
                paddingHorizontal: 10,
                paddingVertical: 15,
                backgroundColor: '#fff',
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: 'lightgray'}}>{this.props.title}</Text>
                </View>
            </View>
        )
    }
}

export class CategoriesScreen extends React.PureComponent {
    static navigationOptions = {
        headerTitle: 'Foire aux questions',
        headerStyle: {
            backgroundColor: '#fff'
        },
        headerTintColor: '#007383',
        headerForceInset: { top: 'never' },
        headerBackTitle: 'Catégories'
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            categories: []
        }
    }

    componentDidMount() {
        Portail.getFAQs()
            .then(categories => this.setState({loading: false, categories: categories}))
            .catch(reason => {
                console.warn(reason);
                Alert.alert(
                    'Foire aux questions non disponible',
                    'Une erreur est survenue lors de la récupération des questions.',
                    [{text: 'OK', onPress: () => this.props.navigation.goBack()}]);
                this.setState({loading: false})
            })

    }

    render() {
        if (this.state.loading)
            return <ScrollView><FakeCategory title={'Chargement...'}/></ScrollView>;
        return (
            <FlatList style={{backgroundColor: '#f4f4f4'}}
                      data={
                          this.state.categories
                              .filter(category => category.parent == null)
                              .map(category => {return {key: category.id, category: category}})}
                      renderItem={({item}) => { return (
                          <View style={{flex: 1, flexDirection: 'column'}}>
                              <Category category={item.category}
                                        onPress={() => { this.props.navigation.navigate({
                                            key: item.key,
                                            routeName: 'Questions',
                                            params: {category: item.category}})} }/>}
                          </View>
                      )}}
                      ItemSeparatorComponent={() => <View style={styles.associations.separator} />}
                      ListEmptyComponent={() => <FakeCategory title={"Aucune question n'a été trouvée"}/>}/>
        )
    }
}