import React from 'react';
import { Image } from 'react-native';

import PortailApi from '../../services/Portail';
import Shortcut from './Shortcut';
import styles from '../../styles';

export default class AssociationShortcut extends Shortcut {
	constructor(props) {
		super(props);

		this.state = {
			id: props.id,
			shortname: props.shortname,
			image: null,
		};

		PortailApi.getAsso(props.id).then(([data]) => {
			this.setState({
				id: data.id,
				shortname: data.shortname,
				image: {
					uri: data.image,
				},
			});
		});
	}

	onPress() {
		const { navigation } = this.props;
		const { id, shortname } = this.props;

		navigation.navigate({
			routeName: 'Association',
			params: {
				id,
				title: shortname,
			},
		});
	}

	getIconSource() {
		const { image } = this.state;

		return image;
	}

	getTitleText() {
		const { shortname } = this.state;

		return shortname;
	}

	getIcon() {
		return (
			<Image source={this.getIconSource()} resizeMode="contain" style={styles.shortcut.associationIcon} />
		);
	}

}
