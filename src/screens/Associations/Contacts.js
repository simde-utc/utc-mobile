import React from 'react';
import { Alert, ScrollView, SectionList, Text, View } from 'react-native';
import styles from '../../styles';
import PortailApi from '../../services/Portail';
import Contact from '../../components/Contact';
import FullWidthBackButton from '../../components/FullWidthBackButton';
import FakeItem from '../../components/FakeItem';

export default class Contacts extends React.PureComponent {
	static navigationOptions = {
		headerTitle: 'Contacts',
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	};

	static pushContact(section, contact) {
		section.push({
			url: contact.value,
			title: contact.type.name,
			subtitle: contact.value,
		});
	}

	constructor(props) {
		super(props);

		this.state = {
			contacts: null,
			loading: true,
		};
	}

	componentDidMount() {
		const { navigation } = this.props;
		const associationId = navigation.state.params.id;

		if (!PortailApi.isConnected()) {
			navigation.goBack(associationId);

			Alert.alert(
				'Association non disponible',
				'Le Portail des Associations est actuellement inaccessible.'
			);
		}

		PortailApi.getAssoContacts(associationId)
			.then(contacts => {
				this.setState({
					contacts,
					loading: false,
				});
			})
			.catch(e => {
				console.log(e);
				navigation.goBack(associationId);

				Alert.alert(
					'Association non disponible',
					'Une erreur est survenue lors de la récupération des moyens de contact.'
				);

				this.setState({ loading: false });
			});
	}

	getSections() {
		const { contacts } = this.state;

		// On défini 3 catégories:
		const [sections, classics, networks, others] = [[], [], [], []];

		for (const key in contacts) {
			const contact = contacts[key];

			switch (contact.type.type) {
				case 'other':
					Contacts.pushContact(others, contact);
					break;

				case 'facebook':
				case 'twitter':
				case 'linkedin':
				case 'snapchat':
				case 'instagram':
					Contacts.pushContact(networks, contact);
					break;

				default:
					Contacts.pushContact(classics, contact);
					break;
			}
		}

		if (classics.length) {
			sections.push({
				title: 'Moyens de contact',
				data: classics,
			});
		}

		if (networks.length) {
			sections.push({
				title: 'Réseaux sociaux',
				data: networks,
			});
		}

		if (others.length) {
			sections.push({
				title: 'Autre',
				data: others,
			});
		}

		return sections;
	}

	render() {
		const { navigation } = this.props;
		const { loading } = this.state;

		return (
			<View>
				<FullWidthBackButton
					name="Retour à la description"
					onPress={() =>
						navigation.navigate({
							routeName: 'AssociationDescription',
							params: navigation.state.params,
						})
					}
				/>
				{loading ? (
					<ScrollView style={styles.scrollable.list}>
						<FakeItem title="Chargement..." />
					</ScrollView>
				) : (
					<SectionList
						style={styles.scrollable.list}
						renderItem={({ item }) => <Contact contact={item} />}
						renderSectionHeader={({ section: { title } }) => (
							<View style={styles.scrollable.sectionHeader.view}>
								<Text style={styles.scrollable.sectionHeader.title}>{title}</Text>
							</View>
						)}
						sections={this.getSections()}
						keyExtractor={(item, index) => item + index}
						ItemSeparatorComponent={() => <View style={styles.scrollable.itemSeparator} />}
						renderSectionFooter={() => <View style={styles.scrollable.sectionSeparator} />}
					/>
				)}
			</View>
		);
	}
}
