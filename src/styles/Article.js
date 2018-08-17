import { colors } from './variables';

export const article = {
	container: {
		height: 100,
		width: '100%',
		borderWidth: 1,
		marginBottom:10,
		backgroundColor: 'lightblue',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},

	loadingIndicatorContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		flex:1,
	},
	loadingIndicatorText: {
		color: colors.lightGray,
	},
	articlesFeedContainer: {
	flex:1,
	alignItems: 'center',
	justifyContent: 'center',
	paddingHorizontal: 10,
	}
};
