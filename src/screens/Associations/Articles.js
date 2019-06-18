import React from 'react';
import { FlatList, Text } from 'react-native';
import PortailApi from '../../services/Portail';
import ArticleComponent from '../../components/Articles/Article';

import { _, getTranslationsFor } from '../../utils/i18n';

const t = getTranslationsFor('screens.Articles');

export default class Articles extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};
	}

	componentDidMount() {
		const { navigation } = this.props;
		const associationId = navigation.state.params.id;

		PortailApi.getArticles() // TODO: gérer la pagination et le chargement dynamique
			.then(articles => {
				this.setState({
					articles: articles[0].filter(
						article => article.owned_by && article.owned_by.id === associationId
					),
					loading: false,
				});
			})
			.catch(reason => {
				console.log(reason);
				this.setState({ loading: false });
			});
	}

	componentWillUnmount() {
		if (PortailApi !== undefined) PortailApi.abortRequest();
	}

	render() {
		const { navigation } = this.props;
		const { loading, articles } = this.state;

		// This will evolve with new ArticleComponent view
		if (loading) return <Text>{_('loading')}</Text>;
		if (articles.length === 0) return <Text>{t('no_articles')}</Text>;
		return (
			<FlatList
				data={articles.map(article => {
					return { key: article.id, article };
				})}
				renderItem={({ item }) => {
					return (
						<ArticleComponent
							navigation={navigation}
							data={item.article}
							portailInstance={PortailApi}
							fullActions
						/>
					);
				}}
			/>
		);
	}
}
