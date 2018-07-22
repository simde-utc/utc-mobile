import { StyleSheet } from 'react-native';
import { colors } from './variables';
import { bigCheckBox } from './bigCheckBox';
import { bigButton } from './bigButton';
import { tabBar } from './tabBar';

export const textColors = Object.keys(colors).reduce((acc, color) => {
	acc[color+'Text'] = { color: colors[color] }
	return acc
}, {})
export const backColors = Object.keys(colors).reduce((acc, color) => {
	acc[color+'Bg'] = { backgroundColor: colors[color] }
	return acc
}, {})

export const textSizes = {
	h0: { fontSize: 38 },
	h1: { fontSize: 32 },
	h2: { fontSize: 24 },
	h3: { fontSize: 20 },
	h4: { fontSize: 16 },
	h5: { fontSize: 12 },
	h6: { fontSize: 10 },
}

const styles = StyleSheet.create({
	...textColors,
	...backColors,
	...textSizes,
	...tabBar,

	container: {
		flex: 1,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
	containerStretched: {
		flex: 1,
		backgroundColor: colors.white,
		justifyContent: 'flex-start',
		alignItems: 'stretch'
	},

	bigCheckBox,
	bigButton,
});

export default styles;
