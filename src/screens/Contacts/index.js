import React from 'react';
import { SectionList, Text, View } from 'react-native';
import styles from '../../styles';
import networkData from '../../data/social_networks';
import Contact from '../../components/Contact';

export default class ContactsScreen extends React.PureComponent {
	static navigationOptions = {
		headerTitle: 'Contacts',
		headerStyle: {
			backgroundColor: '#fff',
		},
		headerTintColor: '#007383',
		headerForceInset: { top: 'never' },
	};

	render() {
		return (
			<SectionList
				style={styles.scrollable.list}
				renderItem={({ item }) => <Contact contact={item.app} />}
				renderSectionHeader={({ section: { title } }) => (
					<View style={styles.scrollable.sectionHeader.view}>
						<Text style={styles.scrollable.sectionHeader.title}>{title}</Text>
					</View>
				)}
				sections={[
					{
						title: 'Réseaux sociaux',
						data: networkData.map(app => {
							return { key: app.name, app };
						}),
					},
				]}
				keyExtractor={(item, index) => item + index}
				ItemSeparatorComponent={() => <View style={styles.scrollable.itemSeparator} />}
				renderSectionFooter={() => <View style={styles.scrollable.sectionSeparator} />}
			/>
		);
	}
}
