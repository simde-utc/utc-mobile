import React from 'react';
import { View, Text} from 'react-native';
// import styles from '../../styles'

export default class ArticleComponent extends React.Component {
	render() {
		return (
			<View style={{height:100, width: '100%', borderWidth: 1, marginBottom:10, backgroundColor: 'lightblue', justifyContent: 'center', alignItems: 'center'}}><Text>Hello! {JSON.stringify(this.props.data)}</Text></View>
		);

		
	}
}
