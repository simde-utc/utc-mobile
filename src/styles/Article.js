import { colors } from './variables';

export const article = {
	container: {
		flex:1,
		borderWidth: 1,
		borderColor: colors.lightGray,
		marginBottom:10,
		backgroundColor: colors.white,
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: 5,
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
		backgroundColor: colors.veryLightGray,
	},
	contentContainer: {
		backgroundColor: 'lightblue',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom:0,
		maxWidth: '95%',
	},
	titleContainer: {
		maxWidth: '95%',
	},
	title: "text-align:center;font-size:20;",
};
