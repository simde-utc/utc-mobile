import React from 'react';
import { Linking, SectionList, Text, TouchableHighlight, View } from 'react-native';
import styles from '../../styles';
import Icon from '../../components/Icon';

class SocialNetwork extends React.PureComponent {
	render() {
		return (
			<TouchableHighlight onPress={() => Linking.openURL(this.props.app.url)}>
				<View style={styles.scrollable.item.view}>
					<View style={{ flex: 1 }}>
						<Text style={styles.scrollable.item.title}>{this.props.app.name}</Text>
						<Text style={styles.scrollable.item.subtitle}>{this.props.app.shortName}</Text>
					</View>
					<View>
						<Icon image={require('../../img/icons/open.png')} />
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}

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
				renderItem={({ item }) => <SocialNetwork app={item.app}/>}
				renderSectionHeader={({ section: { title } }) => (
					<View style={styles.scrollable.sectionHeader.view}>
						<Text style={styles.scrollable.sectionHeader.title}>{title}</Text>
					</View>
				)}
				sections={[
					{
						title: 'Réseaux sociaux',
						data: require('../../data/social_networks').map(app => {
							return { key: app.name, app: app };
						}),
					},
				]}
				keyExtractor={(item, index) => item + index}
				ItemSeparatorComponent={() => <View style={styles.scrollable.itemSeparator}/>}
				renderSectionFooter={() => <View style={styles.scrollable.sectionSeparator}/>}
			/>
		);
	}
}
