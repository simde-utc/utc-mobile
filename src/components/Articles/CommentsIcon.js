import React from 'react';
import { Text, ImageBackground } from 'react-native';
import CommentsWithNumber from '../../img/icons/comms.png';
import styles from '../../styles';

export default class CommentsIcon extends React.PureComponent {
	constructor(props) {
		super(props);
		this.style = styles.article.commentsIconText;
	}

	kplusstylise(previousStyle,i) {
		let style = Object.assign({}, previousStyle);
		switch (i.toString().length) {
			case 0:
			case 1:
				break;
			case 2:
				style.fontSize = 9;
				style.marginTop = 0.58;
				break;
			case 3:
				style.fontSize = 8;
				style.marginTop = 1.5;
				break;
			case 4:
				style.fontSize = 8;
				style.marginTop = 1.3;
				break;
			default:
				// don't mess around
				style.fontSize = 8;
				style.marginTop = 1.3;
				break;
		}
		return style;
	}

	render() {
		const { number } = this.props;
		this.style = this.kplusstylise(this.style,number);
		return (
			<ImageBackground
				style={{ height: 32.99999, width: 30, flexDirection: 'row', justifyContent: 'flex-end' }}
				source={CommentsWithNumber}
			>
				<Text style={this.style}>{number>1000 ? 'k+' : number}</Text>
			</ImageBackground>
		);
	}
}
