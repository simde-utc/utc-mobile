import React from 'react';
import {
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	Text,
	TouchableHighlight,
	View,
} from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { showLocation } from 'react-native-map-link';
import styles from '../../styles';
import Icon from '../../components/Icon';
import mapIcon from '../../img/map.png';
import openIcon from '../../img/icons/open.png';
import locationData from '../../data/locations';

const height = (1662 * Dimensions.get('window').width) / 783; // todo: find a better way

const MapScreen = () => (
	<ScrollView>
		<Image style={{ height, width: '100%' }} source={mapIcon} />
	</ScrollView>
);

const Location = ({ location }) => (
	<TouchableHighlight
		onPress={() =>
			showLocation({
				latitude: location.latitude,
				longitude: location.longitude,
				title: `UTC - ${location.name}`,
				dialogTitle: 'Ouvrir dans la carte', // optional (default: 'Open in Maps')
				dialogMessage: 'Sur quelle application souhaitez-vous afficher le lieu ?', // optional (default: 'What app would you like to use?')
				cancelText: 'Annuler',
			})
		}
	>
		<View style={styles.scrollable.item.view}>
			<View style={{ flex: 1 }}>
				<Text style={styles.scrollable.item.title}>
					{location.name} {location.shortName ? `(${location.shortName})` : null}
				</Text>
				<Text style={styles.scrollable.item.subtitle}>{location.street}</Text>
				<Text style={styles.scrollable.item.subsubtitle}>
					{location.latitude}, {location.longitude}
				</Text>
			</View>
			<View>
				<Icon image={openIcon} />
			</View>
		</View>
	</TouchableHighlight>
);

class LocationsScreen extends React.PureComponent {
	render() {
		return (
			<FlatList
				style={styles.scrollable.list}
				data={locationData.map(location => {
					return { key: location.name, location };
				})}
				renderItem={({ item }) => <Location location={item.location} />}
				ItemSeparatorComponent={() => <View style={styles.scrollable.itemSeparator} />}
			/>
		);
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
