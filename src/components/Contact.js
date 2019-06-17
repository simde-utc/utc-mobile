import React from 'react';
import { Linking, Text, TouchableHighlight, View } from 'react-native';
import styles from '../styles';
import Icon from './Icon';
import openIcon from '../img/icons/open.png';

const Contact = ({ contact }) => (
	<TouchableHighlight onPress={() => Linking.openURL(contact.url)}>
		<View style={styles.scrollable.item.view}>
			<View style={{ flex: 1 }}>
				<Text style={styles.scrollable.item.title}>{contact.title}</Text>
				<Text style={styles.scrollable.item.subtitle}>{contact.subtitle}</Text>
			</View>
			<View>
				<Icon image={openIcon} />
			</View>
		</View>
	</TouchableHighlight>
);

export default Contact;
