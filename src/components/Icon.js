import React from 'react';
import { View, Image } from 'react-native';

// Faire attention: https://github.com/vault-development/react-native-svg-uri#known-bugs
const Icon = ({ style, image, width, height }) => (
	<View style={style || { alignItems: 'center', justifyContent: 'center', flex: 1 }}>
		<Image
			style={{ width: width || 30, height: height || 30 }}
			source={image}
			resizeMode="contain"
		/>
	</View>
);

export default Icon;
