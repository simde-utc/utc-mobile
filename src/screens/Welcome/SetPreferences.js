import React from 'react';
import { View } from 'react-native';
import styles from '../../styles';

// Components
import HeaderView from '../../components/HeaderView';
import BigCheckBox from '../../components/BigCheckBox';
import BigButton from '../../components/BigButton';

export default class SetPreferencesScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			checked: {
				utcNews: true,
				assoLife: true,
				utcMember: false,
			},
		};

		this.toggleCheck = this.toggleCheck.bind(this);
	}

	toggleCheck(key, force = null) {
		return this.setState(prevState => ({
			...prevState,
			checked: {
				...prevState.checked,
				[key]: force == null ? !prevState.checked[key] : force,
			},
		}));
	}

	validate() {
		const { checked } = this.state;
		const { navigation } = this.props;

		if (checked.utcMember) {
			navigation.navigate('Connection');
		} else {
			navigation.navigate('Connected');
		}
	}

	render() {
		const { checked } = this.state;
		const { container, text, mt } = styles;

		const viewStyle = [
			styles.get('container.center', 'mt.xl', 'mb.xxl'),
			{ flex: 7, justifyContent: 'center', marginTop: 0 },
		];

		return (
			<View style={container.default}>
				<HeaderView
					title="Nous aimerions mieux vous connaître"
					subtitle="Cela nous permettra de paramétrer au mieux l'application selon vos préférences"
				/>
				<View style={viewStyle}>
					<BigCheckBox
						checked={checked.utcNews}
						labelStyle={text.h5}
						label="Afficher les actualités UTC"
						onPress={() => this.toggleCheck('utcNews')}
					/>
					<BigCheckBox
						checked={checked.assoLife}
						labelStyle={text.h5}
						label="Afficher la vie associative"
						onPress={() => this.toggleCheck('assoLife')}
					/>
					<BigCheckBox
						checked={checked.utcMember}
						labelStyle={text.h5}
						label="Etes-vous un membre UTC/BDE ?"
						onPress={() => this.toggleCheck('utcMember')}
					/>
					<BigButton label="Valider" style={mt.lg} onPress={this.validate.bind(this)} />
				</View>
			</View>
		);
	}
}
