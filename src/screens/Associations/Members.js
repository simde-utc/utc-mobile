import React from 'react';
import {FlatList, Image, ScrollView, Text, View} from "react-native";
import Portail from "../../services/Portail";
import styles from '../../styles';

class Member extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			role: null,
		};
	}

	componentDidMount() {
		const roleId = this.props.member.pivot.role_id;

		Portail.getRole(roleId)
			.then(role => this.setState({ role: role }))
			.catch(reason => {
				console.warn(reason);
			});
	}

	componentWillUnmount() {
		if (Portail !== undefined) Portail.abortRequest();
	}

	render() {
		return (
			<View style={styles.associations.block.view}>
				{this._renderImage()}
				<View style={styles.associations.block.details}>
					<Text style={styles.scrollable.item.title}>{this.props.member.name}</Text>
					{this.state.role ? <Text style={styles.scrollable.item.subtitle}>{this.state.role.name}</Text> : null}
				</View>
			</View>
		);
	}

	_renderImage() {
		const height = 75,
			width = 75;

		return this.props.member.image ? (
			<Image
				style={{ height: height, width: width }}
				source={{ uri: this.props.member.image }}
				resizeMode="cover"
			/>
		) : (
			<Image
				style={{ height: height, width: width, backgroundColor: '#f1f1f1' }}
				source={require('../../img/icons/picture.png')}
				resizeMode="center"
			/>
		);
	}
}

class FakeMember extends React.PureComponent {
	render() {
		return (
			<View style={styles.associations.block.view}>
				<Image
					style={{ height: 75, width: 75, backgroundColor: '#f1f1f1' }}
					source={require('../../img/icons/picture.png')}
					resizeMode="center"
				/>

				<View style={styles.associations.block.details}>
					<Text style={styles.scrollable.item.lightTitle}>{this.props.title}</Text>
				</View>
			</View>
		);
	}
}

export class MembersView extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			members: [],
			loading: true,
		};
	}

	componentDidMount() {
		const associationId = this.props.navigation.state.params.id;

		Portail.getAssoMembers(associationId)
			.then(members =>
				this.setState({
					members: members.sort((a, b) => a.name.localeCompare(b.name)),
					loading: false,
				})
			)
			.catch(reason => {
				console.warn(reason);
				this.setState({ loading: false });
			});
	}

	componentWillUnmount() {
		if (Portail !== undefined) Portail.abortRequest();
	}

	render() {
		if (this.state.loading)
			return (
				<ScrollView style={styles.scrollable.list}>
					<FakeMember title={'Chargement...'} />
				</ScrollView>
			);
		return (
			<FlatList
				style={styles.scrollable.list}
				data={this.state.members.map(member => {
					return { key: member.id, member: member };
				})}
				renderItem={({ item }) => {
					return <Member member={item.member}/>
				}}
				ItemSeparatorComponent={() => <View style={styles.scrollable.itemSeparator} />}
				ListEmptyComponent={() => <FakeMember title={'Aucun membre'} />}
			/>
		);
	}
}
