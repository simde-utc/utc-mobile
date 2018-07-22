import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles'

export default class HeaderView extends React.Component {
	render() {
		const { title, subtitle } = this.props;
		const titleStyle = styles.get('text.yellow', 'text.h2', 'text.center', 'p.sm');
		const subtitleStyle = styles.get('text.white', 'text.h4', 'text.center');
		const viewStyle = [
			styles.get('container.default', 'bg.lightBlue'),
			{
				flex: 4,
				justifyContent : 'center',
				padding: 20
			},
			this.props.style
		]

		return (
			<View style={ viewStyle }>
				{ title && <Text style={ titleStyle }>{ title }</Text> }
				{ subtitle && <Text style={ subtitleStyle }>{ subtitle }</Text>}
				{ this.props.children }
			</View>
		);
	}
}
