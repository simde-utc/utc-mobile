import React from 'react';
import { FlatList } from 'react-native';
import Comment from './Comment';

export default class Comments extends React.PureComponent {

	constructor(props) {
		super(props);
		if(!props.data) {throw "No data provided";}
	}

	
	render() 
	{
		return (
			<FlatList
				data={this.props.data}
				keyExtractor={(comment) => comment["id"]}
				renderItem={(comment) => <Comment data={comment.item} />}
			/>		
		);
	}
}
