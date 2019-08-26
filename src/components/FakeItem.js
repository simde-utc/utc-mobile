import React from 'react';
import { Text, View } from 'react-native';
import styles from '../styles';

const FakeItem = ({ title }) => (
	<View style={styles.scrollable.item.largeView}>
		<Text style={styles.scrollable.item.lightTitle}>{title}</Text>
	</View>
);

export default FakeItem;
