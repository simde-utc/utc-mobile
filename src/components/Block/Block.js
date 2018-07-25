import React from 'react';
import { TouchableHighlight, View, Text, Image } from 'react-native';

import styles from '../../styles'
import { colors } from '../../styles/variables';

export default class Block extends React.Component {
    children (text, image, element) {
        if (image) {
            if (this.props.extend && (text || element)) {
                if (text) {
                    return (
                        <View style={{ flexDirection: 'row', justifyContent:'center', alignItems: 'center', height: '80%', width: '90%' }}>
                            <Image style={{ flex: 4, height: '100%' }}
                                source={ image }
                                resizeMode="contain"
                            />
                            <Text style={[{ flex: 6 }, styles.text.center ]}>
                                { text }
                            </Text>
                        </View>
                    )
                }
                else {
                    return (
                        <View style={{ flexDirection: 'row', justifyContent:'center', alignItems: 'center', height: '80%', width: '90%' }}>
                            <Image style={{ flex: 4, height: '100%' }}
                                source={ image }
                                resizeMode="contain"
                            />
                            <View style={{ flex: 6 }}>
                                { element }
                            </View>
                        </View>
                    )
                }
            }
            else {
                return (
        			<Image style={{ width: '90%' }}
                        source={ image }
                        resizeMode='center'
                    />
        		)
            }
        }
        else if (text) {
            return (
                <Text style={ styles.text.center }
                >
                    { text }
                </Text>
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
        var style = [
            {
                borderRadius: 3,
                borderWidth: 1,
                borderColor: colors.lightGray
            },
            this.props.style
        ]

        if (this.props.editMode)
            style.push(this.props.editStyle)

		return (
			<TouchableHighlight underlayColor={"#fff0"}
                style={ style }
                onPress={ this.props.onPress }
                onLongPress={ () => this.props.onEditMode && this.props.onEditMode(!this.props.editMode) }
            >
                { this.children(this.props.text, this.props.image, this.props.children) }
			</TouchableHighlight>
		);
	}
}
