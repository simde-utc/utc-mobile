import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles'

export default class HeaderView extends React.Component {
	render() {
		const { title, subtitle } = this.props;
		const titleStyle = [ styles.yellowText , styles.h2, { textAlign: 'center', padding: 10 } ];
		const subtitleStyle = [ styles.whiteText, styles.h4, { textAlign: 'center' } ];

		return (
			<View style={[styles.container, styles.lightBlueBg, { flex: this.props.flexSize || 4, justifyContent : 'center', padding: 20 }]}>
				{ title && <Text style={titleStyle}>{ title } </Text> }
				{ subtitle && <Text style={subtitleStyle}>{ subtitle }</Text>}
				{ this.props.children }
			</View>
		);
	}
}
