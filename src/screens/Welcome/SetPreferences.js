import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../../styles'

// Components
import BigCheckBox from '../../components/BigCheckBox';
import BigButton from '../../components/BigButton';
import HeaderView from '../../components/HeaderView';

export default class SetPreferencesScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			checked: {
				utcNews: true,
				assoLife: true,
				bdeContributor: false,
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

	render() {
		return (
			<View style={styles.containerStretched}>
				<HeaderView
					title="Nous aimerions mieux vous connaître"
					subtitle="Cela nous permettra de paramétrer au mieux l'application selon vos préférences"
				/>
				<View style={[styles.container, styles.whiteBg, {flex: 7, justifyContent: 'center', marginTop: 50, marginBottom: 50 }]}>
					<BigCheckBox checked={ this.state.checked.utcNews }
						labelStyle={styles.h4}
						label={"Afficher les actualités UTC"}
						onChange={() => this.toggleCheck('utcNews')}
					/>
					<BigCheckBox checked={ this.state.checked.assoLife }
						labelStyle={styles.h4}
						label={"Afficher la vie associative"}
						onChange={() => this.toggleCheck('assoLife')}
					/>
					<BigCheckBox checked={ this.state.checked.bdeContributor }
						labelStyle={styles.h4}
						label={"Etes-vous cotisant BDE?"}
						onChange={() => this.toggleCheck('bdeContributor')}
					/>
					<BigButton label={ "Valider" }
						style={{ marginTop: 25}}
						onPress={() => console.log('Lol')}
					/>
				</View>
			</View>
		);
	}
}
