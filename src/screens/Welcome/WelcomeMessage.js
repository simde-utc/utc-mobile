import React from 'react';
import { View, Image, Text } from 'react-native';

import utcLogo from '../../img/logo_utc.png';
import styles from '../../styles';
import { _, Welcome as t } from '../../utils/i18n';

const titleStyle = styles.get('text.yellow', 'text.h0', 'text.center', 'mb.sm');
const subtitleStyle = styles.get('text.gray', 'text.h4', 'text.center', 'mb.xl');
const subsubtitleStyle = styles.get('text.lightGray', 'text.h5', 'text.center', 'mb.xs');

const WelcomeMessageScreen = () => (
	<View style={[styles.container.center, { paddingBottom: '7.5%' }]}>
		<Image source={utcLogo} style={styles.img.logoStyle} resizeMode="center" />
		<Text style={titleStyle}>{_('welcome')} !</Text>
		<Text style={[subtitleStyle, { marginBottom: '12.5%' }]}>{t('discover')}</Text>
		<View style={{ position: 'absolute', bottom: '12.5%' }}>
			<Text style={subsubtitleStyle}>{t('swap_to_begin')}</Text>
		</View>
	</View>
);

export default WelcomeMessageScreen;
