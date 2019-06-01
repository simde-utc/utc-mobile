import React from "react";
import {Alert, FlatList, ScrollView, SectionList, Text, TouchableHighlight, View} from "react-native";
import Icon from "../../components/Icon";
import Portail from "../../services/Portail";
import styles from "../../styles";

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
        headerForceInset: { top: 'never' },
    });

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            questionsByCategory: [], // { category: '', question: {} }
        }
    }

    componentDidMount() {
        const category = this.props.navigation.getParam('category');

        Portail.getFAQ(category.id)
            .then(category => {
                this._fetchQuestions(category);
                category.children.forEach(child => this._fetchQuestions(child));

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

    _fetchQuestions(category) {
        Portail.getFAQQuestions(category.id)
            .then(questions => {
                questions.forEach(question => this.setState({questionsByCategory: [...this.state.questionsByCategory, { category: category.name, question: question}]}));
            })
            .catch(reason => {
                console.warn(reason);
            })
    }

    sortQuestionsInSections(questionsByCategories) {
        const hashMap = [];
        questionsByCategories.forEach(questionWithCategory => {
            if (hashMap[questionWithCategory.category] === undefined)
                hashMap[questionWithCategory.category] = [];

            hashMap[questionWithCategory.category].push(questionWithCategory.question);
        });

        return Object.keys(hashMap).map(categoryName => {
            return {
                title: categoryName,
                data: hashMap[categoryName].map(question => { return {
                    key: question.id,
                    question: question
                }})
            }
        })
    }

    render() {
        if (this.state.loading)
            return <ScrollView><FakeQuestion title={'Chargement...'}/></ScrollView>;
        return (
            <SectionList
                style={{backgroundColor: '#f4f4f4'}}
                renderItem={({item, index, section}) =>  <Question title={item.question.question} answer={item.question.answer}/> }
                renderSectionHeader={({section: {title}}) => (
                    <View style={{
                        padding: 10,
                        backgroundColor: '#f4f4f4',
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: '#007383'}}>{title}</Text>
                    </View>
                )}
                sections={
                    this.sortQuestionsInSections(this.state.questionsByCategory)
                    //[{title: 'Titre', data: this.state.questionsByCategory.map(item => { return { key: item.question.id, category: item.category, question: item.question}})},]
                }
                keyExtractor={(item, index) => item + index}
                ItemSeparatorComponent={() => <View style={{
                    borderBottomWidth: 5,
                    borderBottomColor: '#f4f4f4'
                }} />}
                ListEmptyComponent={() => <FakeQuestion title={"Aucune question n'a été trouvée"}/>}/>
            /*
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
                      ListEmptyComponent={() => <FakeQuestion title={"Aucune question n'a été trouvée"}/>}/>*/
        )
    }
}