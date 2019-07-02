import React from 'react';
import { Text, View } from 'react-native';

const FakeQuestion = ({ title }) => (
	<View
		style={{
			paddingHorizontal: 10,
			paddingVertical: 15,
			backgroundColor: '#fff',
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
		}}
	>
		<View style={{ flex: 1 }}>
			<Text style={{ fontSize: 16, fontWeight: 'bold', color: 'lightgray' }}>{title}</Text>
		</View>
	</View>
);

export default FakeQuestion;
