import React from 'react';
import { Dimensions, FlatList, Image, ScrollView, Text, TouchableHighlight, View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { showLocation } from 'react-native-map-link';
import styles from '../../styles';
import Icon from '../../components/Icon';

class MapScreen extends React.PureComponent {
	render() {
		const source = require('../../img/map.png');
		const height = (1662 * Dimensions.get('window').width) / 783; // todo: find a better way
		return (
			<ScrollView>
				<Image style={{ height: height, width: '100%' }} source={source} />
			</ScrollView>
		);
	}
}

class Location extends React.PureComponent {
	render() {
		return (
			<TouchableHighlight
				onPress={() =>
					showLocation({
						latitude: this.props.location.latitude,
						longitude: this.props.location.longitude,
						title: `UTC - ${  this.props.location.name}`,
						dialogTitle: 'Ouvrir dans la carte', // optional (default: 'Open in Maps')
						dialogMessage: 'Sur quelle application souhaitez-vous afficher le lieu ?', // optional (default: 'What app would you like to use?')
						cancelText: 'Annuler',
					})
				}
			>
				<View style={styles.scrollable.item.view}>
					<View style={{ flex: 1 }}>
						<Text style={styles.scrollable.item.title}>
							{this.props.location.name}{' '}
							{this.props.location.shortName ? '(' + this.props.location.shortName + ')' : null}
						</Text>
						<Text style={styles.scrollable.item.subtitle}>
							{this.props.location.street}
						</Text>
						<Text style={styles.scrollable.item.subsubtitle}>
							{this.props.location.latitude}, {this.props.location.longitude}
						</Text>
					</View>
					<View>
						<Icon image={require('../../img/icons/open.png')} />
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}

class LocationsScreen extends React.PureComponent {
	render() {
		return <FlatList style={styles.scrollable.list}
										 data={require('../../data/locations').map(location => {
											return { key: location.name, location: location };
										 })}
										 renderItem={({ item }) => <Location location={item.location} />}
										 ItemSeparatorComponent={() => <View style={styles.scrollable.itemSeparator} />}
		/>
	}
}

const MapNavigator = createMaterialTopTabNavigator(
	{
		Buildings: {
			screen: MapScreen,
			navigationOptions: {
				title: 'Carte',
			},
		},
		Locations: {
			screen: LocationsScreen,
			navigationOptions: {
				title: 'Lieux',
			},
		},
	},
	{
		tabBarOptions: {
			labelStyle: {
				fontSize: 12,
				fontWeight: 'bold',
				color: '#007383',
			},
			style: {
				backgroundColor: '#fff',
			},
		},
		initialRouteName: 'Buildings',
	}
);

export default MapNavigator;
