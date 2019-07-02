import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import styles from '../../styles';

const Category = ({ onPress, category }) => (
	<TouchableHighlight onPress={onPress}>
		<View style={styles.scrollable.item.view}>
			<View style={{ flex: 1 }}>
				<Text style={styles.scrollable.item.title}>{category.name}</Text>
			</View>
			<View>
				<FontAwesomeIcon icon={['fas', 'arrow-right']} size={20} style={styles.text.yellow} />
			</View>
		</View>
	</TouchableHighlight>
);

export default Category;
