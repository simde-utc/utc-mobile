import React from 'react';
import { Alert, FlatList, ScrollView, Text, TouchableHighlight, View } from 'react-native';
import Icon from '../../components/Icon';
import Portail from '../../services/Portail';
import styles from '../../styles';
import { FakeItem } from '../../components/FakeItem';

class Category extends React.PureComponent {
	render() {
		return (
			<TouchableHighlight onPress={this.props.onPress}>
				<View style={styles.scrollable.item.view}>
					<View style={{ flex: 1 }}>
						<Text style={styles.scrollable.item.title}>{this.props.category.name}</Text>
					</View>
					<View>
						<Icon image={require('../../img/icons/arrow_yellow.png')} />
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}

class FakeCategory extends React.PureComponent {
	render() {
		return (
			<View style={styles.scrollable.item.view}>
				<View style={{ flex: 1 }}>
					<Text style={styles.scrollable.item.lightTitle}>{this.props.title}</Text>
				</View>
			</View>
		);
	}
}

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
		Portail.getFAQs()
			.then(categories => this.setState({ loading: false, categories }))
			.catch(reason => {
				console.warn(reason);
				Alert.alert(
					'Foire aux questions non disponible',
					'Une erreur est survenue lors de la récupération des questions.',
					[{ text: 'OK', onPress: () => this.props.navigation.goBack() }]
				);
				this.setState({ loading: false });
			});
	}

	render() {
		if (this.state.loading)
			return <ScrollView style={styles.scrollable.list}>
							 <FakeItem title="Chargement..." />
			       </ScrollView>;

		return <FlatList style={styles.scrollable.list}
										 data={this.state.categories.filter(category => category.parent == null).map(category => {return { key: category.id, category };})}
										 renderItem={({ item }) => {
										 	return <Category
																category={item.category}
																onPress={() => {
																	this.props.navigation.navigate({
																		key: item.key,
																		routeName: 'Questions',
																		params: { category: item.category },
																	});
																}}
															/>;
										 }}
										 ItemSeparatorComponent={() => <View style={styles.scrollable.itemSeparator} />}
										 ListEmptyComponent={() => <FakeItem title={"Aucune question n'a été trouvée"} />}/>;
	}
}
