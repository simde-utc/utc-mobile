import React from 'react';
import { TouchableHighlight, View, Text, Image, Animated, Easing } from 'react-native';

import styles from '../../styles';
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
};

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
};

export default class Block extends React.Component {
	constructor(props) {
		super(props);

		this.editableValue = new Animated.Value(0);

		this.editableRotation = this.editableValue.interpolate({
			inputRange: [0, 0.25, 0.75, 1],
			outputRange: ['0deg', '1.5deg', '-1.5deg', '0deg'],
		});
	}

	onPress() {
		const { editMode, editable, deleteMode, deletable, id, onPress } = this.props;

		if (editMode && editable !== false) return;

		if (deleteMode && deletable !== false) return;

		if (onPress) onPress(id);
	}

	animateEditMode() {
		const { editMode } = this.props;

		// Animation des blocs en editMode
		if (editMode) {
			this.animatedEditMode = Animated.loop(
				Animated.timing(this.editableValue, {
					toValue: 1,
					duration: 150,
					easing: Easing.linear,
				})
			);

			this.animatedEditMode.start();
		} else if (this.animatedEditMode) {
			this.animatedEditMode.stop();

			// On fini l'animation
			Animated.timing(this.editableValue, {
				toValue: 1,
				duration: 150,
				easing: Easing.linear,
			}).start();

			this.animatedEditMode = undefined;
		}
	}

	editTools() {
		const { editMode, editable, onResize, id, deleteMode, deletable, onDelete } = this.props;
		const tools = [];

		if (editMode && editable !== false) {
			tools.push(
				<TouchableHighlight
					underlayColor="#eee"
					key="resize"
					style={resizeStyle}
					onPress={onResize && onResize(id)}
				>
					<Text>r</Text>
				</TouchableHighlight>
			);
		}

		if (deleteMode && deletable !== false) {
			tools.push(
				<TouchableHighlight
					underlayColor="#eee"
					key="delete"
					style={deleteStyle}
					onPress={onDelete && onDelete(id)}
				>
					<Text>x</Text>
				</TouchableHighlight>
			);
		}

		return tools;
	}

	children(text, image, element) {
		const { extend } = this.props;

		if (image) {
			if (extend && (text || element)) {
				if (text) {
					return (
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								height: '80%',
								width: '80%',
							}}
						>
							<Image style={{ flex: 4, height: '100%' }} source={image} resizeMode="contain" />
							<Text style={[{ flex: 6 }, styles.text.center]}>{text}</Text>
						</View>
					);
				}

				return (
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							height: '80%',
							width: '80%',
						}}
					>
						<Image style={{ flex: 4, height: '100%' }} source={image} resizeMode="contain" />
						<View style={{ flex: 6 }}>{element}</View>
					</View>
				);
			}

			if (text) {
				return (
					<View
						style={{
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							height: '80%',
							width: '80%',
						}}
					>
						<Image style={{ flex: 8, width: '100%' }} source={image} resizeMode="contain" />
						<Text style={[{ flex: 3 }, styles.text.center]} numberOfLines={2}>
							{text}
						</Text>
					</View>
				);
			}

			return <Image style={{ width: '90%' }} source={image} resizeMode="center" />;
		}
		if (text) {
			return <Text style={[styles.text.center, { padding: '2%' }]}>{text}</Text>;
		}
		if (element) {
			return element; /* (
				<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80%', width: '80%' }}>
					{element}
			</View>); */
		}

		return <View />;
	}

	render() {
		const {
			style: propsStyle,
			editMode,
			editStyle,
			editable,
			onEditMode,
			text,
			image,
			children,
		} = this.props;

		const style = [
			{
				borderRadius: 5,
				transform: [{ rotate: this.editableRotation }],
			},
			styles.block.block,
			propsStyle,
			styles.bg.yellow,
		];

		// Animation des blocs en editMode
		if (editMode) style.push(editStyle);

		if (editable !== false) this.animateEditMode();

		return (
			<Animated.View style={style}>
				<TouchableHighlight
					underlayColor="#eee"
					style={[styles.container.center]}
					onPress={this.onPress.bind(this)}
					onLongPress={() => onEditMode} // MOVE
				>
					{this.children(text, image, children)}
				</TouchableHighlight>
				{this.editTools()}
			</Animated.View>
		);
	}
}
