import React from 'react';
import { View } from 'react-native';
import styles from '../styles/';
import { Svg } from 'expo';
// import Svg from 'react-native-svg';

export default class Icon extends React.Component {
	render() {
		return (
			<View style={ styles.container.center }>
				<Svg width={80} height={80}>
					<Svg.Image href={ this.props.image } />
				</Svg>
			</View>
		);
	}
}
