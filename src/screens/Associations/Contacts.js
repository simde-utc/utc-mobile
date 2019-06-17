import React from 'react';
import { SectionList, Text, View } from 'react-native';
import styles from '../../styles';
import FullWidthBackButton from '../../components/FullWidthBackButton';

export default class Contacts extends React.PureComponent {
	static navigationOptions = {
		headerTitle: 'Contacts',
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	};

	render() {
		const { navigation } = this.props;

		return (
			<View>
				<FullWidthBackButton
					name="Retour à la description"
					onPress={() =>
						navigation.navigate({
							routeName: 'AssociationDescription',
							params: navigation.state.params,
						})
					}
				/>
			</View>
		);
	}
}
