import { colors } from './variables';

export const article = {
	container: {
		borderWidth: 1,
		borderColor: colors.lightGray,
		marginHorizontal: 5,
		marginBottom:10,
		backgroundColor: colors.white,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		padding:10,
		paddingBottom: 5,
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
		paddingHorizontal: 2,
		backgroundColor: colors.veryLightGray,
	},
	contentContainer: {
		backgroundColor: colors.white,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		marginBottom:0,
		marginTop:3,
		maxWidth: '100%',
	},
	titleContainer: {
		maxWidth: '100%',
	},
	title: "text-align:left;font-size:20;",
	buttonContainer: {
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 5,
		marginBottom:0,
		maxWidth: '100%',
		paddingVertical: 5,
	},
	imageContainer: {
		backgroundColor: colors.veryLightGray,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 5,
		marginBottom:2,
		maxWidth: '100%',
	},
	contentMarkdown : {},
	descriptionConstants: {
		textColor: colors.black,
	}
};
