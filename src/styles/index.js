import { StyleSheet } from 'react-native';
import { colors } from './variables';

export const textColors = Object.keys(colors).reduce((acc, color) => {
	acc[color+'Text'] = { color: colors[color] }
	return acc
}, {})
export const backColors = Object.keys(colors).reduce((acc, color) => {
	acc[color+'Bg'] = { backgroundColor: colors[color] }
	return acc
}, {})

export const textSizes = {
	largeText: { fontSize: 20 },
	hugeText: { fontSize: 30 },
	bigText : {fontSize: 15}
}

const styles = StyleSheet.create({
	...textColors,
	...backColors,
	...textSizes,
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
	}
});

export default styles;
