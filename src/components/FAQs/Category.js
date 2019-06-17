import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import Icon from '../Icon';
import styles from '../../styles';
import yellowArrowIcon from '../../img/icons/arrow_yellow.png';

const Category = ({ onPress, category }) => (
	<TouchableHighlight onPress={onPress}>
		<View style={styles.scrollable.item.view}>
			<View style={{ flex: 1 }}>
				<Text style={styles.scrollable.item.title}>{category.name}</Text>
			</View>
			<View>
				<Icon image={yellowArrowIcon} />
			</View>
		</View>
	</TouchableHighlight>
);

export default Category;
