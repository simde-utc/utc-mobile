import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../../styles'
import Toast, {DURATION} from 'react-native-easy-toast'

// Components
import HeaderView from '../../components/HeaderView';
import BigCheckBox from '../../components/BigCheckBox';
import BigButton from '../../components/BigButton';

export default class SetPreferencesScreen extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			checked: {
				utcNews: true,
				assoLife: true,
				utcMember: false,
				cgu: false,
			}
		};
		
		this.toggleCheck = this.toggleCheck.bind(this);
	}

	toggleCheck(key, force = null) {
		return this.setState(prevState => ({
			...prevState,
			checked: {
				...prevState.checked,
				[key]: force == null ? !prevState.checked[key] : force
			}
		})
		);
	}

	validate() {
		if(this.state.checked.cgu) {
			if (this.state.checked.utcMember)
				this.props.navigation.navigate('Connection')
			else
				this.props.navigation.navigate('Connected')
		}
		else {
			this.refs.toast.show('Merci d\'accepter les CGU pour accéder à l\'application', 1000)
			//alert('Conditions générales d\'utilisation', 'Merci d\'accepter les CGU pour accéder à l\'application')
		}		
	}

	render() {
		const viewStyle = [
			styles.get('container.center', 'mt.xl', 'mb.xxl'),
			{ flex: 7, justifyContent: 'center', marginTop: 0 } 
		]
{/*** définir une margin : hack pour que la première bigcheckbox ne soit pas rognée ***/}
		return (
			<View style={ styles.container.default }>
                <Toast ref="toast" position='bottom' style={{backgroundColor: 'grey'}}/>
				<HeaderView
					title="Nous aimerions mieux vous connaître"
					subtitle="Cela nous permettra de paramétrer au mieux l'application selon vos préférences"
				/>
				<View style={ viewStyle}>
					<BigCheckBox 
						checked={ this.state.checked.utcNews }
						labelStyle={ styles.text.h5 }
						label={"Afficher les actualités UTC"}
						onChange={() => this.toggleCheck('utcNews')}
					/>
					<BigCheckBox 
						checked={ this.state.checked.assoLife }
						labelStyle={ styles.text.h5 }
						label={"Afficher la vie associative"}
						onChange={() => this.toggleCheck('assoLife')}
					/>
					<BigCheckBox 
						checked={ this.state.checked.utcMember }
						labelStyle={ styles.text.h5 }
						label={"Etes-vous un membre UTC/BDE ?"}
						onChange={() => this.toggleCheck('utcMember')}
					/>
					<BigCheckBox 
						checked={ this.state.checked.cgu }
						labelStyle={ styles.text.h5 }
						label={"Je reconnais avoir lu et compris les CGU"}
						onChange={() => this.toggleCheck('cgu')}
					/>
					<BigButton
						label={ "Valider" }
						style={ styles.mt.lg }
						onPress={ this.validate.bind(this) }
					/>
				</View>
			</View>
		);
	}
}
