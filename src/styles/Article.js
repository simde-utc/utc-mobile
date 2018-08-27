import { colors } from './variables';

export const article = {
	container: {
		borderWidth: 1,
		borderColor: colors.lightGray,
		marginBottom:10,
		backgroundColor: colors.white,
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
		backgroundColor: colors.veryLightGray,
	},
	contentContainer: {
		backgroundColor: 'lightblue',
		alignItems: 'flex-start',
		justifyContent: 'center',
		marginBottom:0,
		marginTop:3,
		maxWidth: '95%',
	},
	titleContainer: {
		maxWidth: '95%',
	},
	title: "text-align:center;font-size:20;",
	buttonContainer: {
		backgroundColor: 'red',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 5,
		marginBottom:2,
		maxWidth: '95%',
	}
};
