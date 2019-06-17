import React from 'react';
import { Alert, FlatList, ScrollView, View } from 'react-native';
import PortailApi from '../../services/Portail';
import styles from '../../styles';
import FakeItem from '../../components/FakeItem';
import Category from '../../components/FAQs/Category';
import FakeCategory from '../../components/FAQs/FakeCategory';

export default class CategoriesScreen extends React.PureComponent {
	static navigationOptions = {
		headerTitle: 'Foire aux questions',
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
		headerBackTitle: 'Catégories',
	};

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
				Alert.alert(
					'Foire aux questions non disponible',
					'Une erreur est survenue lors de la récupération des questions.',
					[{ text: 'OK', onPress: () => navigation.goBack() }]
				);
				this.setState({ loading: false });
			});
	}

	render() {
		const { navigation } = this.props;
		const { loading, categories } = this.state;

		if (loading)
			return (
				<ScrollView style={styles.scrollable.list}>
					<FakeCategory title="Chargement..." />
				</ScrollView>
			);

		return (
			<FlatList
				style={styles.scrollable.list}
				data={categories
					.filter(category => category.parent == null)
					.map(category => {
						return { key: category.id, category };
					})}
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
				ItemSeparatorComponent={() => <View style={styles.scrollable.itemSeparator} />}
				ListEmptyComponent={() => <FakeItem title={"Aucune question n'a été trouvée"} />}
			/>
		);
	}
}
