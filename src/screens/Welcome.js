import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../styles'
import { colors } from '../styles/variables';

var Carousel = require('react-native-carousel');

import BigCheckBox from '../../src/components/Bigcheckbox';

export default class WelcomeScreen extends React.Component {
	render() {

		return (
<Carousel indicatorOffset={0} inactiveIndicatorColor={colors.gray} indicatorColor={colors.yellow} animate={false} indicatorSize={70}>
			<View style={styles.container}>
				<Image source={require('../img/logo_utc.png')} style={{ width: 200, height: 150 }} resizeMode={'center'} />
				<Text style={[ styles.yellowText , styles.hugeText, { textAlign: 'center' } ]}>Bienvenue !</Text>
				<Text style={[ styles.grayText, styles.largeText, { textAlign: 'center' } ]}>Découvrons ensemble l'application</Text>
			</View>
			<View style={[styles.container, {justifyContent: 'flex-start', alignItems: 'stretch'}, {flex: 1}]}>
				<View style={[styles.container, styles.lightBlueBg, {flex: 4, justifyContent : 'space-around', padding: 7}]}>
					<Text style={[ styles.yellowText , styles.hugeText, {textAlign: 'center'} ]}>Nous aimerions mieux vous connaître</Text>
					<Text style={[ styles.whiteText, styles.bigText, { textAlign: 'center' } ]}>Cela nous permettra de paramétrer au mieux l'application selon vos préférences</Text>
{/*** "Cela nous permettra de paramétrer au mieux l'application selon vos paramètres" : un peu redondant ***/}
				</View>
				<View style={[styles.container, styles.whiteBg, {flex: 6, justifyContent: 'center'}]}>
					<BigCheckBox checked={true} style={[ styles.grayText, {textAlign: 'center'} ]} label={"Afficher la vie associative"} width={250} onChange={(checked) => console.log('I am checked', checked)}/>
{/*** C'est ici qu'il faut implémenter redux ***/}
					<BigCheckBox style={[ styles.grayText, {textAlign: 'center'} ]} label={"Afficher les actualités UTC"} width={250}/>
					<BigCheckBox style={[ styles.grayText, {textAlign: 'center'} ]} label={"Etes-vous cotisant BDE?"} width={250}/>
				</View>

			</View>
			
			<View style={styles.container}>
				<Text>Connexion</Text>
			</View>
</Carousel>
		);
	}
}
