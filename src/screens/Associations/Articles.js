import React from "react";
import Portail from "../../services/Portail";
import {FlatList, Text} from "react-native";
import ArticleComponent from "../../components/Articles/Article";

export class ArticlesView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        const associationId = this.props.navigation.state.params.id;

        Portail.getArticles() // TODO: gérer la pagination et le chargement dynamique
            .then(articles => {
                this.setState({
                    articles: articles[0].filter(article => article.owned_by && article.owned_by.id === associationId),
                    loading: false
                })
            })
            .catch(reason => {
                console.log(reason);
                this.setState({loading: false})
            })
    }

    componentWillUnmount() {
        if (Portail !== undefined)
            Portail.abortRequest();
    }

    render() { // This will evolve with new ArticleComponent view
        if (this.state.loading)
            return <Text>Loading...</Text>;
        else if (this.state.articles.length === 0)
            return <Text>Aucun article</Text>;
        else
            return <FlatList data={this.state.articles.map(article => {return {key: article.id, article: article}})}
                             renderItem={({item}) => { return <ArticleComponent navigation={this.props.navigation}
                                                                                data={item.article}
                                                                                portailInstance={Portail}
                                                                                fullActions={true} /> }}/>
    }
}
