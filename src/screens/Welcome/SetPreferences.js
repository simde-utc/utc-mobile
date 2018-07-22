import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../../styles'

// Components
import BigCheckBox from '../../components/BigCheckBox';
import HeaderView from '../../components/HeaderView';

export default class SetPreferencesScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			checked: {
				assoLife: true,
				utcNews: false,
				bdeContributor: false,
			}
		};
		this.toggleCheck = this.toggleCheck.bind(this);
	}

	toggleCheck(key, force = null) {
		// DEBUG
		console.log("IIIIIIINNNN")
		console.log(this.state.checked)
		return this.setState(prevState => ({
			...prevState,
			checked: {
				...prevState.checked,
				[key]: force == null ? !prevState.checked[key] : force
			}
			// DEBUG
		}), () => console.log(this.state.checked)
		);
	}

	render() {
		return (
			<View style={styles.containerStretched}>
				<HeaderView
					title="Nous aimerions mieux vous connaître"
					subtitle="Cela nous permettra de paramétrer au mieux l'application selon vos préférences"
				/>
				<View style={[styles.container, styles.whiteBg, {flex: 7, justifyContent: 'center'}]}>
					<BigCheckBox checked={ this.state.checked.assoLife }
						labelStyle={styles.h4} width={250}
						label={"Afficher la vie associative"}
						onChange={() => this.toggleCheck('assoLife')}
					/>
					<BigCheckBox checked={ this.state.checked.utcNews } 
						labelStyle={styles.h4} width={250}
						label={"Afficher les actualités UTC"}
						onChange={() => this.toggleCheck('utcNews')}
					/>
					<BigCheckBox checked={ this.state.checked.bdeContributor } 
						labelStyle={styles.h4} width={250}
						label={"Etes-vous cotisant BDE?"}
						onChange={() => this.toggleCheck('bdeContributor')}
					/>
				</View>
			</View>
		);
	}
}
