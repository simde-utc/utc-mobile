import React from 'react';
import { Alert, ScrollView, SectionList, Text, View } from 'react-native';
import PortailApi from '../../services/Portail';
import styles from '../../styles';
import FakeItem from '../../components/FakeItem';
import Question from '../../components/FAQs/Question';
import FakeQuestion from '../../components/FAQs/FakeQuestion';

export default class Questions extends React.PureComponent {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: navigation.getParam('category').name,
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	});

	static sortQuestionsInSections(questionsByCategories) {
		const hashMap = [];
		questionsByCategories.forEach(questionWithCategory => {
			if (hashMap[questionWithCategory.category] === undefined)
				hashMap[questionWithCategory.category] = [];

			hashMap[questionWithCategory.category].push(questionWithCategory.question);
		});

		return Object.keys(hashMap).map(categoryName => {
			return {
				title: categoryName,
				data: hashMap[categoryName].map(question => {
					return {
						key: question.id,
						question,
					};
				}),
			};
		});
	}

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			questionsByCategory: [], // { category: '', question: {} }
		};
	}

	componentDidMount() {
		const { navigation } = this.props;
		const category = navigation.getParam('category');

		PortailApi.getFAQ(category.id)
			.then(category => {
				this.fetchQuestions(category);
				category.children.forEach(child => this.fetchQuestions(child));
			})
			.catch(reason => {
				console.warn(reason);
				Alert.alert(
					'Impossible de récupérer les questions',
					'Une erreur est survenue lors de la récupération des questions.',
					[{ text: 'OK', onPress: () => navigation.goBack() }]
				);
				this.setState({ loading: false });
			});
	}

	fetchQuestions(category) {
		PortailApi.getFAQQuestions(category.id)
			.then(questions => {
				questions.forEach(question => {
					const { questionsByCategory } = this.state;

					this.setState({
						questionsByCategory: [...questionsByCategory, { category: category.name, question }],
						loading: false,
					});
				});
			})
			.catch(reason => {
				console.warn(reason);
				this.setState({ loading: false });
			});
	}

	render() {
		const { loading, questionsByCategory } = this.state;

		if (loading)
			return (
				<ScrollView style={styles.scrollable.list}>
					<FakeQuestion title="Chargement..." />
				</ScrollView>
			);

		return (
			<SectionList
				style={styles.scrollable.list}
				renderItem={({ item }) => (
					<Question title={item.question.question} answer={item.question.answer} />
				)}
				renderSectionHeader={({ section: { title } }) => (
					<View style={styles.scrollable.sectionHeader.view}>
						<Text style={styles.scrollable.sectionHeader.title}>{title}</Text>
					</View>
				)}
				sections={Questions.sortQuestionsInSections(questionsByCategory)}
				keyExtractor={(item, index) => item + index}
				ItemSeparatorComponent={() => <View style={styles.scrollable.itemSeparator} />}
				renderSectionFooter={() => <View style={styles.scrollable.sectionSeparator} />}
				ListEmptyComponent={() => <FakeItem title={"Aucune question n'a été trouvée"} />}
			/>
		);
	}
}
