import React from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';

import PortailApi from '../../services/Portail';
import styles from '../../styles';
import { e } from '../../utils/i18n';

export default class Details extends React.PureComponent {
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
				</ScrollView>
			);
		return null;
	}
}
