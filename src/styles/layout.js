import { StyleSheet } from 'react-native';
import { createStyleFromList, colors, spaces } from './variables';

// Background colors
export const bgColors = createStyleFromList(colors, 'backgroundColor');

// Containers
export const containers = StyleSheet.create({
	default: {
		flex: 1,
		backgroundColor: colors.white,
		alignItems: 'center',
		width: "100%"
	},
	center: {
		flex: 1,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
	padded: {
		paddingHorizontal: spaces.md,
		paddingVertical: spaces.sm
	},
	grid: {
		flex: 1,
	}
})

export const blocks = StyleSheet.create({
	default: {
		flex: 1,
		margin: '3%',
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center'
	}
})

// Paddings
export const padding = {
	p: createStyleFromList(spaces, 'padding'),
	py: createStyleFromList(spaces, 'paddingHorizontal'),
	px: createStyleFromList(spaces, 'paddingVertical'),
	pt: createStyleFromList(spaces, 'paddingTop'),
	pb: createStyleFromList(spaces, 'paddingBottom'),
	pl: createStyleFromList(spaces, 'paddingLeft'),
	pr: createStyleFromList(spaces, 'paddingRight')
};

// Margins
export const margin = {
	m: createStyleFromList(spaces, 'margin'),
	my: createStyleFromList(spaces, 'marginHorizontal'),
	mx: createStyleFromList(spaces, 'marginVertical'),
	mt: createStyleFromList(spaces, 'marginTop'),
	mb: createStyleFromList(spaces, 'marginBottom'),
	ml: createStyleFromList(spaces, 'marginLeft'),
	mr: createStyleFromList(spaces, 'marginRight'),
}


export default layout = {
	container: containers,
	block: blocks,
	bg: bgColors,
	...padding,
	...margin,
};
