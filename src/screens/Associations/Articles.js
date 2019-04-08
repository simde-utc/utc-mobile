import React from "react";
import Portail from "../../services/Portail";
import {Alert, FlatList} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import ArticleComponent from "../../components/Articles/Article";

export class ArticlesView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            articles: []
        }
    }

    componentDidMount() {
        const associationId = this.props.navigation.state.params.id;

        Portail.getArticles() // TODO: gérer la pagination et le chargement dynamique
            .then(articles => {
                this.setState({
                    articles: articles[0].filter(article => article.owned_by && article.owned_by.id === associationId)
                })
            })
            .catch(reason => {
                console.warn(reason);
                Alert.alert(
                    "Articles non disponible",
                    "Une erreur est survenue lors de la récupération des articles.",
                    [{text: 'OK', onPress: () => this.props.navigation.goBack(associationId)}])
            })
    }

    componentWillUnmount() {
        if (Portail !== undefined)
            Portail.abortRequest();
    }

    render() {
        if (this.state.articles.length === 0)
            return <Spinner visible={true}/>;
        else
            return <FlatList
                data={this.state.articles.map(article => {return {key: article.id, article: article}})}
                renderItem={({item}) => { return <ArticleComponent navigation={this.props.navigation} data={item.article} portailInstance={Portail} fullActions={true} /> }}/>
    }
}
