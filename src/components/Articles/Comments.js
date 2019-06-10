import React from 'react';
import { FlatList } from 'react-native';
import Comment from './Comment';
import styles from '../../styles';

export default class Comments extends React.PureComponent {
	constructor(props) {
		super(props);

		if (!props.data) {
			throw 'No data provided';
		}

		this.flatListRef = React.createRef();
	}

	render() {
		const { data } = this.props;

		return (
			<FlatList
				data={data}
				keyExtractor={comment => comment.id}
				renderItem={comment => <Comment data={comment.item} />}
				ref={this.flatListRef}
				getItemLayout={(data, index) => ({
					length: styles.comment.container.height,
					offset: styles.comment.container.height * index,
					index,
				})}
			/>
		);
	}
}
