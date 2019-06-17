import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import Icon from '../Icon';
import styles from '../../styles';
import downBlueArrowIcon from '../../img/down_blue_develop_arrow.png';

export default class Question extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			displayAnswer: false,
		};
	}

	render() {
		const { title, answer } = this.props;
		const { displayAnswer } = this.state;

		return (
			<View>
				<TouchableHighlight
					onPress={() => {
						this.setState({ displayAnswer: !displayAnswer });
					}}
					activeOpacity={1}
				>
					<View
						style={{
							padding: 10,
							paddingBottom: 0,
							backgroundColor: '#fff',
						}}
					>
						<Text style={styles.scrollable.item.title}>{title}</Text>
						<View
							style={{
								flex: 1,
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<Icon
								style={displayAnswer ? { transform: [{ rotate: '180deg' }] } : null}
								image={downBlueArrowIcon}
							/>
						</View>
					</View>
				</TouchableHighlight>

				{displayAnswer ? (
					<View
						style={{
							padding: 10,
							paddingTop: 0,
							backgroundColor: '#fff',
						}}
					>
						<Text style={{ fontSize: 14, color: '#6d6f71' }} selectable>
							{answer}
						</Text>
					</View>
				) : null}
			</View>
		);
	}
}
