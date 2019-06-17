import React from 'react';
import { Text, View } from 'react-native';
import styles from '../../styles';

const FakeQuestion = ({ title }) => (
	<View style={styles.scrollable.item.view}>
		<View style={{ flex: 1 }}>
			<Text style={styles.scrollable.item.lightTitle}>{title}</Text>
		</View>
	</View>
);

export default FakeQuestion;
