import React from 'react';
import { View, Image, Text, ScrollView, Button, TextInput, Picker } from 'react-native';
import styles from '../styles'
import { colors } from '../styles/variables';

import Map from '../components/Map';


export default class MapTestScreen extends React.Component {
		
	constructor(props) {
		super(props);
	}
	state = {
		log: "",
		viewPort: {},
		knownLocation: '',
	}
	
	defaultValues = {
	}	

	log = (data, error = false) => {
		this.setState(prevState => ({ ...prevState, log: data }));
		if (error)
			console.warn(data)
		else
			console.log(data);
	
	}

	showEncules = () => {
		this.setState(prevState => ({ ...prevState,
			viewPort: {
					bounds: [[50.63364,3.04494], [50.63366,3.04496]]
				},
		}));
	}

	showBF = () => {
		this.setState(prevState => ({ ...prevState,
			knownLocation: 'BF',
		}));
	}


	render() {
		return (<View style={{flex:1}}>
		<View style={{flex:2}}>	
			<Map
				viewPort={this.state.viewPort}
				knownLocation={this.state.knownLocation}
			/>
</View>
<View style={{flex:2, backgroundColor:"lightblue", justifyContent: 'center', alignItems: 'center'}}>
<Text>Hello Map'UTC</Text>
<Button onPress={ () => {this.showEncules();} } title="Afficher des gens pas très gentils" />
<Button onPress={ () => {this.showBF();} } title="Home of the pic" />
</View>
</View>

		);
	}
}
