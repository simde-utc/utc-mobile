import React from 'react';
import { Alert, Image, ScrollView, Text, View, SectionList } from 'react-native';

import Contact from '../../components/Contact';
import FakeItem from '../../components/FakeItem';
import PortailApi from '../../services/Portail';
import styles from '../../styles';
import { _, e } from '../../utils/i18n';

export default class Details extends React.PureComponent {
	static pushContact(section, contact) {
		section.push({
			title: contact.type.name,
			icon: contact.type.type,
			url: contact.value,
		});
	}

	constructor(props) {
		super(props);

		this.state = {
			association: null,
			loading: true,
			contacts: null,
			loadingContacts: true,
		};
	}

	componentDidMount() {
		const { navigation } = this.props;
		const associationId = navigation.state.params.id;

		if (!PortailApi.isConnected()) {
			navigation.goBack(associationId);

			Alert.alert(e('association_not_available'), e('portail_error'));
		}

		PortailApi.getAssoDetails(associationId)
			.then(association => {
				this.setState({
					association,
					loading: false,
				});
			})
			.catch(e => {
				console.log(e);
				navigation.goBack(associationId);

				Alert.alert(e('association_not_available'), e('retrieving_error'));
				this.setState({ loading: false });
			});

		PortailApi.getAssoContacts(associationId)
			.then(contacts => {
				this.setState({
					contacts,
					loadingContacts: false,
				});
			})
			.catch(e => {
				console.log(e);
				navigation.goBack(associationId);

				Alert.alert(
					'Association non disponible',
					'Une erreur est survenue lors de la récupération des moyens de contact.'
				);

				this.setState({ loadingContacts: false });
			});
	}

	componentWillUnmount() {
		if (PortailApi !== undefined) PortailApi.abortRequest();
	}

	getSections() {
		const { contacts } = this.state;

		// On défini 3 catégories:
		const [sections, classics, networks, others] = [[], [], [], []];

		for (const key in contacts) {
			const contact = contacts[key];

			switch (contact.type.type) {
				case 'other':
					Details.pushContact(others, contact);
					break;

				case 'facebook':
				case 'twitter':
				case 'linkedin':
				case 'snapchat':
				case 'instagram':
				case 'youtube':
					Details.pushContact(networks, contact);
					break;

				default:
					Details.pushContact(classics, contact);
					break;
			}
		}

		if (classics.length) {
			sections.push({
				title: _('contacts'),
				data: classics,
			});
		}

		if (networks.length) {
			sections.push({
				title: _('social_networks'),
				data: networks,
			});
		}

		if (others.length) {
			sections.push({
				title: _('others'),
				data: others,
			});
		}

		return sections;
	}

	renderLogo() {
		const { association } = this.state;

		if (!association.image) {
			return null;
		}

		return (
			<View style={styles.associations.details.logoView}>
				<Image
					style={{ height: 200, width: 200, margin: 5 }}
					source={{ uri: association.image }}
					resizeMode="contain"
				/>
			</View>
		);
	}

	render() {
		const { loading, association, loadingContacts } = this.state;

		if (!loading && association)
			return (
				<ScrollView style={{ backgroundColor: '#fff' }}>
					{this.renderLogo()}
					<View style={{ padding: 15 }}>
						<Text style={styles.associations.details.textView.title}>{association.shortname}</Text>
						<Text style={styles.associations.details.textView.subtitle}>{association.name}</Text>
					</View>
					<View style={styles.associations.separator} />
					<View style={{ padding: 15 }}>
						<Text style={styles.associations.details.textView.description}>
							{association.description}
						</Text>
					</View>
					{loadingContacts ? (
						<ScrollView style={styles.scrollable.list}>
							<FakeItem title="Chargement..." />
						</ScrollView>
					) : (
						<SectionList
							style={styles.scrollable.list}
							renderItem={({ item }) => <Contact {...item} />}
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
				</ScrollView>
			);
		return null;
	}
}
