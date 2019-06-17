import React from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import PortailApi from '../../services/Portail';
import styles from '../../styles';
import FullWidthButton from '../../components/FullWidthButton';

export default class Description extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			association: null,
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

				Alert.alert(
					'Association non disponible',
					'Une erreur est survenue lors de la récupération des informations.'
				);
				this.setState({ loading: false });
			});
	}

	componentWillUnmount() {
		if (PortailApi !== undefined) PortailApi.abortRequest();
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
		const { navigation } = this.props;
		const { loading, association } = this.state;

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
					<View style={{ padding: 15 }}>
						<Text style={styles.associations.details.textView.description}>
							{association.description}
						</Text>
					</View>
					<View style={{ padding: 15 }}>
						<FullWidthButton
							name="Moyens de contact"
							onPress={() =>
								navigation.navigate({
									routeName: 'AssociationContacts',
									params: navigation.state.params,
								})
							}
						/>
					</View>
				</ScrollView>
			);
		return null;
	}
}
