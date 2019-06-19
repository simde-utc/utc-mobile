import React from 'react';
import { Linking, Text, TouchableHighlight, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import styles from '../styles';
import Icon from './Icon';
import openIcon from '../img/icons/open.png';

export default class Contact extends React.Component {
	onPress() {
		const { url: value, icon } = this.props;
		let url;

		switch (icon) {
			case 'email':
				url = `mailto:${value}`;
				break;

			case 'phone':
				url = `tel:${value}`;
				break;

			default:
				url = value;
				break;
		}

		Linking.canOpenURL(url).then(supported => {
			console.log(supported);
			if (supported) {
				Linking.openURL(url);
			}
		});
	}

	getIcon() {
		const { icon: name } = this.props;
		let icon;

		switch (name) {
			case 'facebook':
				icon = ['fab', 'facebook-f'];
				break;

			case 'instagram':
				icon = ['fab', 'instagram'];
				break;

			case 'linkedin':
				icon = ['fab', 'linkedin-in'];
				break;

			case 'twitter':
				icon = ['fab', 'twitter'];
				break;

			case 'youtube':
				icon = ['fab', 'youtube'];
				break;

			case 'email':
				icon = ['far', 'envelope'];
				break;

			case 'url':
				icon = ['fas', 'globe'];
				break;

			default:
				if (name) {
					icon = ['fas', name];
					break;
				} else {
					return;
				}
		}

		return (
			<View style={styles.scrollable.item.icon}>
				<FontAwesomeIcon icon={icon} size={22} style={styles.text.lightBlue} />
			</View>
		);
	}

	render() {
		const { url, title, subtitle } = this.props;

		return (
			<TouchableHighlight
				onPress={this.onPress.bind(this)}
				underlayColor="#007383"
				activeOpacity={0.7}
			>
				<View style={styles.scrollable.item.view}>
					{this.getIcon()}
					<View style={{ flex: 1 }}>
						<Text style={styles.scrollable.item.title}>{title}</Text>
						<Text style={styles.scrollable.item.subtitle}>{subtitle || url}</Text>
					</View>
					<View>
						<FontAwesomeIcon icon={['fas', 'external-link-alt']} size={22} style={styles.text.yellow} />
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}
