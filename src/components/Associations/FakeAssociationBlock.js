import React from 'react';
import { Image, Text, View } from 'react-native';
import styles from '../../styles';
import pictureIcon from '../../img/icons/picture.png';

const FakeAssociationBlock = ({ title, subtitle }) => (
	<View style={styles.associations.block.view}>
		<Image
			style={{ height: 100, width: 100, backgroundColor: '#f1f1f1' }}
			source={pictureIcon}
			resizeMode="center"
		/>
		<View style={styles.associations.block.details}>
			<Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f1f1f1' }}>{title || ''}</Text>
			<Text style={{ fontSize: 13, fontWeight: 'bold', color: '#f1f1f1' }}>{subtitle || ''}</Text>
		</View>
	</View>
);

export default FakeAssociationBlock;
