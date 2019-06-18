import React from 'react';
import { FlatList, Image, ScrollView, Text, View } from 'react-native';
import PortailApi from '../../services/Portail';
import styles from '../../styles';
import pictureIcon from '../../img/icons/picture.png';

import { _, getTranslationsFor } from '../../utils/i18n';

const t = getTranslationsFor('screens.Associations');

export class Member extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			role: null,
		};
	}

	componentDidMount() {
		const { member } = this.props;

		PortailApi.getRole(member.pivot.role_id)
			.then(role => this.setState({ role }))
			.catch(reason => {
				console.warn(reason);
			});
	}

	componentWillUnmount() {
		if (PortailApi !== undefined) PortailApi.abortRequest();
	}

	renderImage() {
		const { member } = this.props;
		const [height, width] = [75, 75];

		return member.image ? (
			<Image style={{ height, width }} source={{ uri: member.image }} resizeMode="cover" />
		) : (
			<Image
				style={{ height, width, backgroundColor: '#f1f1f1' }}
				source={pictureIcon}
				resizeMode="center"
			/>
		);
	}

	render() {
		const { member } = this.props;
		const { role } = this.state;

		return (
			<View style={styles.associations.block.view}>
				{this.renderImage()}
				<View style={styles.associations.block.details}>
					<Text style={styles.scrollable.item.title}>{member.name}</Text>
					{role ? <Text style={styles.scrollable.item.subtitle}>{role.name}</Text> : null}
				</View>
			</View>
		);
	}
}

class FakeMember extends React.PureComponent {
	render() {
		const { title } = this.props;

		return (
			<View style={styles.associations.block.view}>
				<Image
					style={{ height: 75, width: 75, backgroundColor: '#f1f1f1' }}
					source={pictureIcon}
					resizeMode="center"
				/>

				<View style={styles.associations.block.details}>
					<Text style={styles.scrollable.item.lightTitle}>{title}</Text>
				</View>
			</View>
		);
	}
}

export default class Members extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			members: [],
			loading: true,
		};
	}

	componentDidMount() {
		const { navigation } = this.props;
		const associationId = navigation.state.params.id;

		PortailApi.getAssoMembers(associationId)
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
		if (PortailApi !== undefined) PortailApi.abortRequest();
	}

	render() {
		const { loading, members } = this.state;

		if (loading)
			return (
				<ScrollView style={styles.scrollable.list}>
					<FakeMember title={_('loading')} />
				</ScrollView>
			);
		return (
			<FlatList
				style={styles.scrollable.list}
				data={members.map(member => {
					return { key: member.id, member };
				})}
				renderItem={({ item }) => {
					return <Member member={item.member} />;
				}}
				ItemSeparatorComponent={() => <View style={styles.scrollable.itemSeparator} />}
				ListEmptyComponent={() => <FakeMember title={t('no_members')} />}
			/>
		);
	}
}
