import React from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import CASAuth from '../../services/CASAuth';
import PortailApi from '../../services/Portail';
import styles from '../../styles';
import utcIcon from '../../img/icon.png';

export default class ProfileHeader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			login: '',
		};

		if (CASAuth.isConnected()) {
			CASAuth.getLogin().then(login => {
				this.setState(prevState => {
					prevState.login = login;
					return prevState;
				});
			});
		}
	}

	render() {
		const { onPress } = this.props;
		const imagePath = PortailApi.isConnected() ? { uri: PortailApi.getUser().image } : utcIcon;
		const fullName = PortailApi.getUser().name;

		// TODO: prévoir le cas lorsque l'utilisateur n'est pas connecté

		return (
			<TouchableHighlight onPress={this.props.onPress} underlayColor="#fff" activeOpacity={0.7}>
				<View style={styles.userProfile.view}>
					<Image style={styles.userProfile.image} source={imagePath} />
					<Text style={styles.userProfile.name}>{fullName}</Text>
				</View>
			</TouchableHighlight>
		);
	}
}
