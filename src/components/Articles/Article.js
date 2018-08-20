import React from 'react';
import { View, Text} from 'react-native';
import styles from '../../styles'

export default class ArticleComponent extends React.Component {
	render() {
		return (
			<View style={styles.article.container}>
				<Text>{JSON.stringify(this.props.data)}</Text>
			</View>
		);

		
	}
}
