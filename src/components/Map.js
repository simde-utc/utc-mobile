/**
 * Affiche une CARTE, Rémy, une CARTE DE L'UTC et pas autre chose
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/

import React from 'react';
import { View, Text } from 'react-native';

import WebViewLeaflet from 'react-native-webview-leaflet';


export default class Map extends React.Component {

	constructor(props) {
		super(props);
		
	}

	showBF() {
//[49.41551, 2.81866],
		this.webViewLeaflet.sendMessage({
			bounds: [[49.41550, 2.81865], [49.41552,2.81867]],			
		});
	}

	componentDidUpdate(prevProps, prevState) {
		console.log(prevProps);
		console.log(this.props);
		if(prevProps.viewPort !== this.props.viewPort) {
			this.webViewLeaflet.sendMessage(this.props.viewPort);
		}

		if(prevProps.knownLocation !== this.props.knownLocation) {
			switch(this.props.knownLocation) {
				case 'BF':
				default:
					this.showBF();
					break;
				break;
			}
		}
	}
	
	render() {
		return (
			<View style={{flex:1}} >
			<WebViewLeaflet
			  // get a reference to the web view so that messages can be sent to the map
			  ref={(component) => (this.webViewLeaflet = component)}

			  // the component that will receive map events
			  eventReceiver={this}  
			/>
			</View>
		);
	}



}
