import React from 'react';
import { Text, View } from 'react-native';
import Comments from './Comments';
import styles from '../../styles'
import {colors} from '../../styles/variables';

//TODO: factoriser le nametag

export default class Comment extends React.PureComponent {

	constructor(props) {
		super(props);
		if(!this.props.data) {throw "No data provided";}
	}

	render() 
	{
		return (<View style={styles.comment.container}>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Text style={{fontSize: 8, color: colors.lightGray, marginRight: 3}}>{this.props.data["user"]["firstname"]}</Text>
					<Text style={{fontSize: 10, color: colors.gray}}>{this.props.data["body"]}</Text>
				</View>
				{(this.props.data["children"] && this.props.data["children"].length != 0) &&
					<View style={{marginLeft: 5}}>
					<Comments data={this.props.data["children"]} />
					</View>
				}	
			</View>		
		);
	}
}
