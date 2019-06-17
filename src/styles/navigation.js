export default {
	scrollView: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#f4f4f4',
	},

	fullWidthButton: {
		touchable: {
			backgroundColor: '#fff',
			marginBottom: 7,
			minHeight: 45,
		},

		view: {
			paddingVertical: 7,
			paddingLeft: 5,
			paddingRight: 7,
			backgroundColor: '#fff',
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
		},

		textView: {
			borderLeftWidth: 2,
			borderLeftColor: '#fff',
			paddingLeft: 2,
			flex: 1,
		},

		text: {
			fontSize: 17,
			fontWeight: 'bold',
			color: '#007383',
		},

		icon: {
			width: 25,
		},

		backView: {
			paddingVertical: 7,
			paddingLeft: 7,
			paddingRight: 5,
			flex: 1,
			backgroundColor: '#fff',
			flexDirection: 'row',
			alignItems: 'center',
		},

		textBackView: {
			borderRightWidth: 2,
			borderRightColor: '#fff',
			paddingRight: 2,
			flex: 1,
		},

		textBack: {
			fontSize: 17,
			fontWeight: 'bold',
			color: '#007383',
			textAlign: 'right',
		},
	},
};
