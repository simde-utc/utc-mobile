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
	showBF() {
		this.webViewLeaflet.sendMessage({
			bounds: [[49.41550, 2.81865], [49.41552,2.81867]],
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.target !== this.props.target) {
			this.webViewLeaflet.sendMessage({
				bounds: [
					[
						(parseFloat(this.props.target[0]) - 0.00001).toFixed(5),
						(parseFloat(this.props.target[1]) - 0.00001).toFixed(5),
					], [
						(parseFloat(this.props.target[0]) + 0.00001).toFixed(5),
						(parseFloat(this.props.target[1]) + 0.00001).toFixed(5),
					],
				],
				locations: [{
					coords: this.props.target,
					icon: "Ici"
				}]
			});
		}

		if (prevProps.viewPort !== this.props.viewPort)
			this.webViewLeaflet.sendMessage(this.props.viewPort);

		if (prevProps.knownLocation !== this.props.knownLocation) {
			switch(this.props.knownLocation) {
				case 'BF':
				default:
					this.showBF();
					break;
				break;
			}
		}
	}

	onLoad = ({ payload }) => {
		this.showBF()

		this.props.loaded && this.props.loaded()
	}

	render() {
		return (
			<View style={{ flex:1 }} >
				<WebViewLeaflet
				  ref={ (component) => (this.webViewLeaflet = component) }
				  eventReceiver={ this }
				  centerButton={ false }
				/>
			</View>
		);
	}



}
