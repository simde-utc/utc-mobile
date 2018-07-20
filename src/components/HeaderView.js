import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles'

export default class HeaderView extends React.Component {
	render() {
		const { title, subtitle } = this.props;
		const titleStyle = [ styles.yellowText , styles.hugeText, { textAlign: 'center', paddingBottom: 10 } ];
		const subtitleStyle = [ styles.whiteText, styles.bigText, { textAlign: 'center' } ];
		
		return (
			<View style={[styles.container, styles.lightBlueBg, { flex: 4, justifyContent : 'center', padding: 4 }]}>
				{ title && <Text style={titleStyle}>{ title } </Text> }
				{ subtitle && <Text style={subtitleStyle}>{ subtitle }</Text>}
				{ this.props.children }
			</View>
		);
	}
}