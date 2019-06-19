import React from 'react';
import { Alert, SectionList, ScrollView, View, Text } from 'react-native';

import FakeItem from '../../components/FakeItem';
import Category from '../../components/FAQs/Category';
import FakeCategory from '../../components/FAQs/FakeCategory';
import PortailApi from '../../services/Portail';
import styles from '../../styles';
import { _, FAQs as t, e } from '../../utils/i18n';

export default class CategoriesScreen extends React.PureComponent {
	static navigationOptions = () => ({
		headerTitle: _('faq'),
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
		headerBackTitle: _('categories'),
	});

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			categories: [],
		};
	}

	componentDidMount() {
		const { navigation } = this.props;

		PortailApi.getFAQs()
			.then(categories => this.setState({ loading: false, categories }))
			.catch(reason => {
				console.warn(reason);

				Alert.alert(_('faq'), e('get_question_error'), [
					{ text: _('ok'), onPress: () => navigation.goBack() },
				]);

				this.setState({ loading: false });
			});
	}

	getSections() {
		const { categories } = this.state;

		return [
			{
				title: _('categories'),
				data: categories
					.filter(category => category.parent == null)
					.map(category => {
						return { key: category.id, category };
					}),
			},
		];
	}

	render() {
		const { navigation } = this.props;
		const { loading } = this.state;

		if (loading)
			return (
				<ScrollView style={styles.scrollable.list}>
					<FakeCategory title={_('loading')} />
				</ScrollView>
			);

		return (
			<View>
				<SectionList
					style={styles.scrollable.list}
					sections={this.getSections()}
					renderItem={({ item }) => {
						return (
							<Category
								category={item.category}
								onPress={() => {
									navigation.navigate({
										key: item.key,
										routeName: 'Questions',
										params: { category: item.category },
									});
								}}
							/>
						);
					}}
					renderSectionHeader={({ section: { title } }) => (
						<View style={styles.scrollable.sectionHeader.view}>
							<Text style={styles.scrollable.sectionHeader.title}>{title}</Text>
						</View>
					)}
					ItemSeparatorComponent={() => <View style={styles.scrollable.itemSeparator} />}
					ListEmptyComponent={() => <FakeItem title={t('no_questions')} />}
				/>
			</View>
		);
	}
}
