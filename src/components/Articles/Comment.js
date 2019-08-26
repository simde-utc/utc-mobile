import React from 'react';
import { Text, View } from 'react-native';

import Comments from './Comments';
import styles from '../../styles';
import { colors } from '../../styles/variables';
import { e } from '../../utils/i18n';

// TODO: factoriser le nametag

export default class Comment extends React.PureComponent {
	constructor(props) {
		super(props);

		if (!props.data) {
			throw e('no_data_provided');
		}
	}

	render() {
		const { data } = this.props;

		return (
			<View style={styles.comment.container}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={{ fontSize: 8, color: colors.lightGray, marginRight: 3 }}>
						{data.user.firstname}
					</Text>
					<Text style={{ fontSize: 10, color: colors.gray }}>{data.body}</Text>
				</View>
				{data.children && data.children.length !== 0 && (
					<View style={{ marginLeft: 5 }}>
						<Comments data={data.children} />
					</View>
				)}
			</View>
		);
	}
}
