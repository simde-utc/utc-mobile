import React from 'react';
import { Text, View } from 'react-native';
import styles from '../styles';

export class FakeItem extends React.PureComponent {
	render() {
		return (
			<View style={styles.scrollable.item.largeView}>
				<Text style={styles.scrollable.item.lightTitle}>{this.props.title}</Text>
			</View>
		);
	}
}
