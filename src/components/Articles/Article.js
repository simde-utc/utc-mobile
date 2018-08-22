import React from 'react';
import { View, Text} from 'react-native';
import styles from '../../styles'
import { colors } from '../../styles/variables';
import Hr from '../Hr';

export default class ArticleComponent extends React.Component {
	render() {
		return (
			<View style={styles.article.container}>
				<View style={[styles.article.contentContainer, {height:20}]}>
					<Text>{ this.props.data["title"] } - {this.props.data["created_at"] ? this.props.data["created_at"] : this.props.data["date_gmt"]}</Text>
				</View>
			<Hr style={{backgroundColor: colors.veryLightGray, marginVertical: 5}} />
			<View><Text>\/</Text></View>
			</View>
		);


	}
}
