import React from 'react';
import { FlatList, ScrollView, View } from 'react-native';

import PortailApi from '../../services/Portail';
import ArticleComponent from '../../components/Articles/Article';
import FakeItem from '../../components/FakeItem';
import styles from '../../styles';
import { _, Articles as t } from '../../utils/i18n';

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
		if (loading)
			return (
				<ScrollView style={styles.scrollable.list}>
					<FakeItem title={_('loading')} />
				</ScrollView>
			);
		return (
			<FlatList
				style={styles.scrollable.list}
				data={articles.map(article => {
					return { key: article.id, article: { item: article } };
				})}
				renderItem={({ item }) => {
					return (
						<ArticleComponent
							navigation={navigation}
							data={item.article}
							portailInstance={PortailApi}
						/>
					);
				}}
				ItemSeparatorComponent={() => <View style={styles.scrollable.sectionSeparator} />}
				ListEmptyComponent={() => <FakeItem title={t('no_articles')} />}
			/>
		);
	}
}
