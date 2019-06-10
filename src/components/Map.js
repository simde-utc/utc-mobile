/**
 * Affiche une carte
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
 * */

import React from 'react';
import { View } from 'react-native';

import WebViewLeaflet from 'react-native-webview-leaflet';

export default class Map extends React.Component {
	componentDidUpdate(prevProps) {
		const { target, viewPort, knownLocation } = this.props;

		if (prevProps.target !== target) {
			this.webViewLeaflet.sendMessage({
				bounds: [
					[
						(parseFloat(target[0]) - 0.00001).toFixed(5),
						(parseFloat(target[1]) - 0.00001).toFixed(5),
					],
					[
						(parseFloat(target[0]) + 0.00001).toFixed(5),
						(parseFloat(target[1]) + 0.00001).toFixed(5),
					],
				],
				locations: [
					{
						coords: target,
						icon: 'Ici',
					},
				],
			});
		}

		if (prevProps.viewPort !== viewPort) {
			this.webViewLeaflet.sendMessage(viewPort);
		}

		if (prevProps.knownLocation !== knownLocation) {
			switch (knownLocation) {
				case 'BF':
				default:
					this.showBF();
					break;
			}
		}
	}

	onLoad() {
		const { loaded } = this.props;

		this.showBF();

		loaded && loaded();
	}

	showBF() {
		this.webViewLeaflet.sendMessage({
			bounds: [[49.4155, 2.81865], [49.41552, 2.81867]],
		});
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<WebViewLeaflet
					ref={component => (this.webViewLeaflet = component)}
					eventReceiver={this}
					centerButton={false}
				/>
			</View>
		);
	}
}
