import React from 'react';
import { Linking, Text, TouchableHighlight, View } from 'react-native';
import styles from '../styles';
import Icon from './Icon';
import openIcon from '../img/icons/open.png';

const SocialNetwork = ({ app }) => (
	<TouchableHighlight onPress={() => Linking.openURL(app.url)}>
		<View style={styles.scrollable.item.view}>
			<View style={{ flex: 1 }}>
				<Text style={styles.scrollable.item.title}>{app.name}</Text>
				<Text style={styles.scrollable.item.subtitle}>{app.shortName}</Text>
			</View>
			<View>
				<Icon image={openIcon} />
			</View>
		</View>
	</TouchableHighlight>
);

export default SocialNetwork;
