/**
 * Affiche un menu de filtrage
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
 * */

import React from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableHighlight } from 'react-native';

import Color from '../utils/Color';

import styles from '../styles';
import searchIcon from '../img/search.png';

const viewStyle = {
	height: 50,
	width: '100%',
	paddingHorizontal: 20,
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
};

const filtersStyle = {
	flexDirection: 'row',
	marginLeft: 10,
	flex: 1,
	transform: [{ scaleX: -1 }],
};

const filterStyle = {
	paddingHorizontal: 5,
	paddingVertical: 3,
	transform: [{ scaleX: -1 }],
};

const filterTextStyle = {
	borderRadius: 10,
	paddingHorizontal: 5,
	paddingVertical: 1,
	fontSize: 12,
};

const searchStyle = {
	height: 25,
	flexDirection: 'row',
	alignItems: 'center',
	borderWidth: 1,
	borderRadius: 15,
	borderColor: 'grey',
	backgroundColor: 'white',
};

const searchImageStyle = {
	marginHorizontal: 5,
	width: 15,
	height: 15,
};

const searchTextStyle = {
	marginHorizontal: 5,
	width: 100,
	fontSize: 11,
};

const searchLaunchStyle = {
	paddingRight: 5,
	height: '100%',
	alignItems: 'center',
};

const searchLaunchTextStyle = [
	styles.text.yellow,
	{
		height: '100%',
	},
];

// /!\ Attention, à cause d'un bug React native, il est nécessaire de tout inverser pour que le scrollview s'affiche bien
export default class Filter extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			search: '',
			seeSearch: false,
			canSearch: false,
		};
	}

	onSearch() {
		const { onSearch, searchButton } = this.props;
		const { search } = this.state;

		if (search.length > 0 && onSearch && searchButton !== false) {
			this.onSearch(search);
		}
	}

	renderFilter(id, filter) {
		const {
			filters,
			selectedFilters,
			onFilterUnselected,
			onFilterSelected,
			onFilterLongPressed,
		} = this.props;
		const style = [filterStyle];
		const textStyle = [filterTextStyle];
		let onPress;

		if (id + 1 < filters.length) {
			style.push({
				borderRightWidth: 2,
			});
			style.push(styles.border.yellow);
		}

		if ((selectedFilters || []).includes(filter.id)) {
			if (filter.selectedColor) {
				textStyle.push({
					backgroundColor: filter.selectedColor,
					color: Color.invertColor(filter.selectedColor, true),
				});
			} else textStyle.push(styles.bg.yellow);

			onPress = onFilterUnselected;
		} else {
			onPress = onFilterSelected;
		}

		return (
			<TouchableHighlight
				style={style}
				key={filter.id}
				onPress={() => {
					onPress && onPress(filter.id);
				}}
				onLongPress={() => {
					onFilterLongPressed && onFilterLongPressed(filter.id);
				}}
				underlayColor="#fff0"
			>
				<Text style={textStyle}>#{filter.name}</Text>
			</TouchableHighlight>
		);
	}

	render() {
		const { searchText, onSearchTextChange, searchButton, filters } = this.props;
		const { seeSearch, search, canSearch } = this.state;

		// Il faut qu'on réinverse ici aussi
		setTimeout(() => {
			this.scrollView.scrollToEnd();
		}, 10);

		return (
			<View style={viewStyle}>
				<View style={searchStyle}>
					<TouchableHighlight
						onPress={() => {
							this.setState(prevState => {
								prevState.seeSearch = !prevState.seeSearch;
								return prevState;
							});
						}}
						underlayColor="#fff0"
					>
						<Image style={searchImageStyle} source={searchIcon} />
					</TouchableHighlight>
					{seeSearch && (
						<TextInput
							style={searchTextStyle}
							underlineColorAndroid="transparent"
							placeHolder={searchText || 'Rechercher'}
							value={searchText || search}
							onChangeText={text => {
								if (onSearchTextChange) text = onSearchTextChange(text) || text;

								this.setState(() => {
									return { canSearch: text.length > 0, search: text };
								});
							}}
							onSubmitEditing={this.onSearch.bind(this)}
							autoCapitalize="none"
							keyboardType="email-address"
							autoCorrect={false}
							autoFocus
						/>
					)}
					{seeSearch && (
						<TouchableHighlight
							style={[searchLaunchStyle, canSearch && searchButton !== false ? {} : { opacity: 0 }]}
							onPress={this.onSearch.bind(this)}
							underlayColor="#fff0"
						>
							<Text style={searchLaunchTextStyle}>{'\u27A4'}</Text>
						</TouchableHighlight>
					)}
				</View>
				<ScrollView
					ref={component => (this.scrollView = component)}
					style={filtersStyle}
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					{filters
						.map((filter, id) => {
							return this.renderFilter(id, filter);
						})
						.reverse()}
				</ScrollView>
			</View>
		);
	}
}
