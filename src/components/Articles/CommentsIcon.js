import React from 'react';
import { Text, ImageBackground } from 'react-native';
import CommentsWithNumber from '../../img/icons/comms.png';
import styles from '../../styles';

export default class CommentsIcon extends React.PureComponent {
	constructor(props) {
		super(props);

		this.style = styles.article.commentsIconText;
		this.tenkplus = false;

		switch (props.number.toString().length) {
			case 0:
			case 1:
			case 2:
				break;
			case 3:
				this.style.fontSize = 8;
				this.style.marginTop = 2;
				break;
			case 4:
				this.style.fontSize = 6;
				this.style.marginTop = 2.5;
				break;
			default:
				// faut pas déconner
				this.tenkplus = true;
				this.style.fontSize = 6;
				this.style.marginTop = 2.5;
				break;
		}
	}

	render() {
		const { number } = this.props;

		return (
			<ImageBackground
				style={{ height: 32.99999, width: 30, flexDirection: 'row', justifyContent: 'flex-end' }}
				source={CommentsWithNumber}
			>
				<Text style={this.style}>{this.tenkplus ? '10k+' : number}</Text>
			</ImageBackground>
		);
	}
}
