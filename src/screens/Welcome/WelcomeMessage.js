import React from 'react';
import { View, Image, Text } from 'react-native';
import styles from '../../styles';
import utcLogo from '../../img/logo_utc.png';

const titleStyle = styles.get('text.yellow', 'text.h0', 'text.center', 'mb.sm');
const subtitleStyle = styles.get('text.gray', 'text.h4', 'text.center', 'mb.xl');
const subsubtitleStyle = styles.get('text.lightGray', 'text.h5', 'text.center', 'mb.xs');

const WelcomeMessageScreen = () => (
	<View style={[styles.container.center, { paddingBottom: '7.5%' }]}>
		<Image source={utcLogo} style={styles.img.logoStyle} resizeMode="center" />
		<Text style={titleStyle}>Bienvenue !</Text>
		<Text style={[subtitleStyle, { marginBottom: '12.5%' }]}>
			Découvrons ensemble l'application
		</Text>
		<View style={{ position: 'absolute', bottom: '12.5%' }}>
			<Text style={subsubtitleStyle}>Glissez vers la droite pour commencer</Text>
		</View>
	</View>
);

export default WelcomeMessageScreen;
