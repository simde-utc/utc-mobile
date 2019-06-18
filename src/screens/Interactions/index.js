import React from 'react';
import { View, WebView } from 'react-native';

import { INTERACTIONS_URL } from '../../../config';
import { _ } from '../../utils/i18n';

export default class Interactions extends React.PureComponent {
	static navigationOptions = {
		headerTitle: _('interactions'),
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#961039',
		headerForceInset: { top: 'never' },
	};

	render() {
		return (
			<View style={{ flex: 1 }}>
				<WebView source={{ uri: INTERACTIONS_URL }} useWebKit />
			</View>
		);
	}
}
