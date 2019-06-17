import React from 'react';
import { View, WebView } from 'react-native';

export default class InteractionsScreen extends React.PureComponent {
	static navigationOptions = {
		headerTitle: 'Interactions',
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#961039',
		headerForceInset: { top: 'never' },
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<WebView source={{ uri: 'https://interactions.utc.fr/' }} useWebKit />
			</View>
		);
	}
}
