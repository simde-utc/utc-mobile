import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../../styles'

import BigCheckBox from '../../components/Bigcheckbox';

export default class SetPreferencesScreen extends React.Component {
	render() {
		return (
			<View style={[styles.container, {justifyContent: 'flex-start', alignItems: 'stretch'}, {flex: 1}]}>
				<View style={[styles.container, styles.lightBlueBg, {flex: 4, justifyContent : 'center', padding: 7}]}>
					<Text style={[ styles.yellowText , styles.hugeText, {textAlign: 'center', marginTop: 13} ]}>
						Nous aimerions mieux vous connaître
					</Text>
					<Text style={[ styles.whiteText, styles.bigText, { textAlign: 'center' } ]}>
						Cela nous permettra de paramétrer au mieux l'application selon vos préférences
					</Text>
				</View>
				<View style={[styles.container, styles.whiteBg, {flex: 6, justifyContent: 'center'}]}>
					<BigCheckBox checked={true} style={[ styles.grayText, {textAlign: 'center'} ]} label={"Afficher la vie associative"} width={250} onChange={(checked) => console.log('I am checked', checked)}/>
					<BigCheckBox style={[ styles.grayText, {textAlign: 'center'} ]} label={"Afficher les actualités UTC"} width={250}/>
					<BigCheckBox style={[ styles.grayText, {textAlign: 'center'} ]} label={"Etes-vous cotisant BDE?"} width={250}/>
				</View>
			</View>
		);
	}
}