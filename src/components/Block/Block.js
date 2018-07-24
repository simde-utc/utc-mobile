import React from 'react';
import { TouchableHighlight, View, Text, Image } from 'react-native';

import styles from '../../styles'

export default class Block extends React.Component {
    children (text, image, element) {
        if (text) {
            return (
                <Text style={ styles.text.center }
                >
                    { text }
                </Text>
            )
        }
        else if (image) {
            return (
    			<Image style={{ width: '100%' }}
                    source={ image }
                    resizeMode='center'
                />
    		)
        }
        else if (element) {
            return element
        }
        else {
            return (
                <View></View>
            )
        }
    }

    render() {
        const style = [
            {
                borderRadius: 5,
            },
            this.props.style
        ]

		return (
			<TouchableHighlight underlayColor={"#fff0"}
                style={ style }
            >
                { this.children(this.props.text, this.props.image, this.props.children) }
			</TouchableHighlight>
		);
	}
}
