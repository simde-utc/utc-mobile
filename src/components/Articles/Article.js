import React from 'react';
import { View, Text} from 'react-native';
import styles from '../../styles'

export default class ArticleComponent extends React.Component {
	render() {
		return (
			<View style={styles.article.container}>
				<Text>{ this.props.data["title"] } - {this.props.data["created_at"] ? this.props.data["created_at"] : this.props.data["date_gmt"]}</Text>
			</View>
		);


	}
}
