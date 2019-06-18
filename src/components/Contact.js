import React from 'react';
import { Linking, Text, TouchableHighlight, View } from 'react-native';
import styles from '../styles';
import Icon from './Icon';
import openIcon from '../img/icons/open.png';
import FacebookIcon from '../img/icons/social-networks/facebook.png';
import InstagramIcon from '../img/icons/social-networks/instagram.png';
import LinkedinIcon from '../img/icons/social-networks/linkedin.png';
import TwitterIcon from '../img/icons/social-networks/twitter.png';
import YoutubeIcon from '../img/icons/social-networks/youtube.png';

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
				icon = FacebookIcon;
				break;

			case 'instagram':
				icon = InstagramIcon;
				break;

			case 'linkedin':
				icon = LinkedinIcon;
				break;

			case 'twitter':
				icon = TwitterIcon;
				break;

			case 'youtube':
				icon = YoutubeIcon;
				break;

			default:
				return;
		}

		return (
			<View style={styles.scrollable.item.icon}>
				<Icon image={icon} />
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
						<Icon image={openIcon} />
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}
