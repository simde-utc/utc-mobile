import React from 'react';
import { Text, View } from 'react-native';
import Button from 'react-native-button';
import { resetNavigation } from '../../utils/navigation'
import styles from '../../styles'

// Components
import HeaderView from '../../components/HeaderView'
import BigButton from '../../components/BigButton';

// API
import PortailApi from '../../services/Portail'

export default class ConnectedScreen extends React.Component {
	static navigationOptions = {
		title: 'Connected',
		headerStyle: {
			display: 'none',
		}
	};

	constructor (props) {
		super(props)

		if (PortailApi.isConnected()) {
			this.subTitle = "Vous êtes maintenant connecté(e) sous " + PortailApi.getUser().name + " !"
			this.more = "et tout ceci, de manière personnalisée"
		}
		else
			this.subTitle = "Vous n'êtes connecté(e) sous aucun compte"
	}

	render () {
		const viewStyle = [
			styles.get('container.default', 'bg.white', 'pt.xl', 'pb.xxl'),
			{ flex: 7 }
		];

		return (
			<View style={ styles.container.default }>
				<HeaderView
					title="Bienvenue !"
					subtitle={ this.subTitle }
				/>
				<View style={ viewStyle }>
					<Text style={[ styles.get('text.h3', 'text.center'), { marginVertical: 25 } ]}>
						Vous pouvez dès à présent utiliser toutes les fonctionnalités de l'application { this.more }
					</Text>
					<BigButton
						label="Aller à la page d'accueil"
						style={ styles.mt.lg }
						onPress={ () => resetNavigation(this.props.navigation) }
					/>
				</View>
			</View>
		);
	}
}
