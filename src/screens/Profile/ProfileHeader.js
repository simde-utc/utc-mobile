import React from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';

import PortailApi from '../../services/Portail';
import styles from '../../styles';
import utcIcon from '../../img/icon.png';

export default class ProfileHeader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			image: PortailApi.isConnected() ? { uri: PortailApi.getUser().image } : utcIcon,
			name: PortailApi.getUser().name,
		};
	}

	render() {
		const { onPress } = this.props;
		const { image, name } = this.state;

		return (
			<TouchableHighlight onPress={onPress} underlayColor="#fff" activeOpacity={0.7}>
				<View style={styles.userProfile.view}>
					<Image style={styles.userProfile.image} source={image} />
					<Text style={styles.userProfile.name}>{name}</Text>
				</View>
			</TouchableHighlight>
		);
	}
}
