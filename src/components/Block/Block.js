import React from 'react';
import { TouchableHighlight, View, Text, Image, Animated, Easing } from 'react-native';
import Button from 'react-native-button';

import styles from '../../styles'
import { colors } from '../../styles/variables';

const deleteStyle = {
	position: 'absolute',
	backgroundColor: '#F00',
	borderWidth: 1,
	borderRadius: 5,
	borderColor: colors.lightGray,
	top: 0,
	right: 0,
	width: 20,
	height: 20,
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 100,
}

const resizeStyle = {
	position: 'absolute',
	backgroundColor: colors.lightGray,
	borderWidth: 1,
	borderRadius: 5,
	borderColor: colors.lightGray,
	bottom: 0,
	left: 0,
	width: 20,
	height: 20,
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 100,
}

export default class Block extends React.Component {
	constructor(props) {
		super(props)

		this.editableValue = new Animated.Value(0)

		this.editableRotation = this.editableValue.interpolate({
			inputRange: [0, 0.25, 0.75, 1],
			outputRange: ['0deg', '1.5deg', '-1.5deg', '0deg']
		})
	}

	animateEditMode() {
		// Animation des blocs en editMode
		if (this.props.editMode) {
			this.animatedEditMode = Animated.loop(
				Animated.timing(
					this.editableValue,
					{
						toValue: 1,
						duration: 150,
						easing: Easing.linear
					}
				),
			)

			this.animatedEditMode.start()
		}
		else if (this.animatedEditMode) {
			this.animatedEditMode.stop()

			// On fini l'animation
			Animated.timing(
				this.editableValue,
				{
					toValue: 1,
					duration: 150,
					easing: Easing.linear
				}
			).start()

			this.animatedEditMode = undefined
		}
	}

	children(text, image, element) {
		if (image) {
			if (this.props.extend && (text || element)) {
				if (text) {
					return (
						<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '80%', width: '80%' }}>
							<Image style={{ flex: 4, height: '100%' }}
								source={ image }
								resizeMode="contain"
							/>
							<Text style={[{ flex: 6 }, styles.text.center]}>
								{text}
							</Text>
						</View>
					)
				}
				else {
					return (
						<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '80%', width: '80%' }}>
							<Image style={{ flex: 4, height: '100%' }}
								source={ image }
								resizeMode="contain"
							/>
							<View style={{ flex: 6 }}>
								{element}
							</View>
						</View>
					)
				}
			}
			else {
				if (text) {
					return (
						<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80%', width: '80%' }}>
							<Image style={{ flex: 8, width: '100%' }}
								source={ image }
								resizeMode="contain"
							/>
							<Text style={[{ flex: 2 }, styles.text.center]}>
								{text}
							</Text>
						</View>);

				}
				else {
					return (
						<Image style={{ width: '90%' }}
							source={ image }
							resizeMode='center'
						/>);

				}


			}
		}
		else if (text) {
			return (
				<Text style={[styles.text.center, { padding: '2%' }]}
				>
					{text}
				</Text>
			)
		}
		else if (element) {
			return element;/*(
				<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80%', width: '80%' }}>
					{element}
			</View>);*/
		}
		else {
			return (
				<View></View>
			)
		}
	}

	editTools() {
		var tools = []

		if (this.props.editMode && this.props.editable !== false) {
			tools.push(
				<TouchableHighlight underlayColor={'#eee'}
					key='resize'
					style={resizeStyle}
					onPress={this.props.onResize && this.props.onResize(this.props.id)}
				>
					<Text>r</Text>
				</TouchableHighlight>
			)
		}

		if (this.props.deleteMode && this.props.deletable !== false) {
			tools.push(
				<TouchableHighlight underlayColor={'#eee'}
					key='delete'
					style={deleteStyle}
					onPress={this.props.onDelete && this.props.onDelete(this.props.id)}
				>
					<Text>x</Text>
				</TouchableHighlight>
			)
		}

		return tools
	}

	onPress() {
		if (this.props.editMode && this.props.editable !== false)
			return

		if (this.props.deleteMode && this.props.deletable !== false)
			return

		if (this.props.onPress)
			this.props.onPress(this.props.id)
	}

	render() {
		var style = [
			{
				borderRadius: 5,
				transform: [{ rotate: this.editableRotation }],
			},
			styles.block.block,
			this.props.style,
			styles.bg.yellow,
		]

		// Animation des blocs en editMode
		if (this.props.editMode)
			style.push(this.props.editStyle)

		if (this.props.editable !== false)
			this.animateEditMode()

		return (
			<Animated.View style={style}>
				<TouchableHighlight underlayColor={'#eee'}
					style={[styles.container.center]}
					onPress={this.onPress.bind(this)}
					onLongPress={() => this.props.onEditMode} // MOVE
				>
					{this.children(this.props.text, this.props.image, this.props.children)}
				</TouchableHighlight>
				{this.editTools()}
			</Animated.View>
		);
	}
}
