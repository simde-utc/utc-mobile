import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../../styles'

// Components
import BigCheckBox from '../../components/BigCheckBox';
import HeaderView from '../../components/HeaderView';

export default class SetPreferencesScreen extends React.Component {
	render() {
		const BigCheckBoxStyle = [ styles.grayText, {textAlign: 'center'} ]
		return (
			<View style={[styles.container, {justifyContent: 'flex-start', alignItems: 'stretch'}, {flex: 1}]}>
				<HeaderView
					title="Nous aimerions mieux vous connaître"
					subtitle="Cela nous permettra de paramétrer au mieux l'application selon vos préférences"
				/>
				<View style={[styles.container, styles.whiteBg, {flex: 6, justifyContent: 'center'}]}>
					<BigCheckBox checked={true} style={BigCheckBoxStyle} 
						label={"Afficher la vie associative"} width={250}
						onChange={(checked) => console.log('I am checked', checked)}/>
					<BigCheckBox style={BigCheckBoxStyle} 
						label={"Afficher les actualités UTC"} width={250} />
					<BigCheckBox style={BigCheckBoxStyle} 
						label={"Etes-vous cotisant BDE?"} width={250} />
				</View>
			</View>
		);
	}
}