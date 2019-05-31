import React from "react";
import {Alert, FlatList, ScrollView, Text, TouchableHighlight, View} from "react-native";
import Icon from "../../components/Icon";
import styles from "../../styles";
import Portail from "../../services/Portail";

class Question extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            displayAnswer: false,
        }
    }

    render() {
        return (
            <View>
                <TouchableHighlight onPress={() => {this.setState({displayAnswer: !this.state.displayAnswer})}} activeOpacity={1}>
                    <View style={{
                        padding: 10,
                        paddingBottom: 0,
                        backgroundColor: '#fff',
                    }}>
                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{this.props.title}</Text>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <Icon style={this.state.displayAnswer ? {transform: [{ rotate: '180deg'}]} : null} image={require('../../img/down_blue_develop_arrow.png')}/>
                        </View>
                    </View>
                </TouchableHighlight>

                { this.state.displayAnswer ?
                    (<View style={{
                        padding: 10,
                        paddingTop: 0,
                        backgroundColor: '#fff'
                    }}>
                        <Text style={{fontSize: 14, color: '#6d6f71'}} selectable={true}>{this.props.answer}</Text>
                    </View>)
                    :
                    null
                }
            </View>
        )
    }
}

class FakeQuestion extends React.PureComponent {
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

export class QuestionsScreen extends React.PureComponent {
    static navigationOptions = ({ navigation }) => ({
        headerTitle: navigation.getParam('category').name,
        headerStyle: {
            backgroundColor: '#fff'
        },
        headerTintColor: '#007383',
        headerForceInset: { top: 'never' }
    });

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            questions: [],
        }
    }

    componentDidMount() {
        const category = this.props.navigation.getParam('category');

        Portail.getFAQ(category.id)
            .then(category => {
                this._fetchQuestions(category.id);
                category.children.forEach(child => this._fetchQuestions(child.id));

                this.setState({loading: false});

            })
            .catch(reason => {
                console.warn(reason);
                Alert.alert(
                    'Impossible de récupérer les questions',
                    'Une erreur est survenue lors de la récupération des questions.',
                    [{text: 'OK', onPress: () => this.props.navigation.goBack()}]);
                this.setState({loading: false})
            })
    }

    _fetchQuestions(categoryId) {
        Portail.getFAQQuestions(categoryId)
            .then(questions => {
                questions.forEach(question => this.setState({questions: [...this.state.questions, question]}));
            })
            .catch(reason => {
                console.warn(reason);
            })
    }

    render() {
        if (this.state.loading)
            return <ScrollView><FakeQuestion title={'Chargement...'}/></ScrollView>;
        return (
            <FlatList style={{backgroundColor: '#f4f4f4'}}
                      data={this.state.questions.map(question => {return {key: question.id, question: question}})}
                      renderItem={({item}) => { return (
                          <View style={{flex: 1, flexDirection: 'column'}}>
                              <Question title={item.question.question} answer={item.question.answer}/>
                          </View>
                      )}}
                      ItemSeparatorComponent={() => <View style={{
                          borderBottomWidth: 5,
                          borderBottomColor: '#f4f4f4'
                      }} />}
                      ListEmptyComponent={() => <FakeQuestion title={"Aucune question n'a été trouvée"}/>}/>
        )
    }
}