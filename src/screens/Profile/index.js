import React from 'react';
import { Text, View, Image } from 'react-native';
import styles from '../../styles'

// Components
import HeaderView from '../../components/HeaderView'
import BigButton from '../../components/BigButton';

// API
import PortailApi from '../../services/Portail'

export default class ProfileScreen extends React.Component {
	static navigationOptions = {
		title: 'Compte',
		headerStyle: {
			display: 'none',
		}
	};

	constructor (props) {
		super(props)

		if (!PortailApi.isConnected())
			props.navigation.navigate('Connection')
	}

	render () {
		const viewStyle = [
			styles.get('container.default', 'bg.white', 'pt.xl', 'pb.xxl'),
			{ flex: 7 }
		];

		return (
			<View style={ styles.container.default }>
				<HeaderView>
						<Image style={ styles.img.bigAvatar } source={ require('../../img/icon.png') } />
						<Text style={ styles.get('text.h1', 'text.yellow') }>{ PortailApi.getUser().name }</Text>
				</HeaderView>
				<View style={ viewStyle }>
					<Text style={[ styles.get('text.h2', 'text.center'), { margin: 20 } ]}>
						Bla bla bla bla des infos...
					</Text>
					<BigButton
						label="Se déconnecter"
						style={ styles.mt.lg }
						onPress={ () => { PortailApi.logout(); return this.props.navigation.navigate('Connection') } }
					/>
				</View>
			</View>
		);
	}
}
