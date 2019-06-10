/**
 * Affiche la liste des assos en fonction de données du portail
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 * @author Louis Pineau <louis.pineau@etu.utc.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
 * */

import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import Markdown from 'react-native-simple-markdown';
import Hr from '../../components/Hr';
import { colors } from '../../styles/variables';
import styles from '../../styles';
import AssoTrombiComponent from '../../components/Assos/AssoTrombi';

const markdownStyles = {
	heading1: {
		fontSize: 24,
		color: colors.gray,
	},
	link: {
		color: colors.yellow,
	},
	mailTo: {
		color: colors.lightBlue,
	},
	text: {
		color: colors.black,
	},
	listItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
};

const ToDoView = () => {
	<ScrollView
		contentContainerStyle={{
			flex: 1,
			alignItems: 'center',
			justifyContent: 'flex-start',
			backgroundColor: colors.veryLightGray,
			paddingHorizontal: 30,
		}}
	>
		<Text>TODO</Text>
	</ScrollView>;
};

export default class AssoScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			warn: false,
			message: '',
			description: '',
			type: '',
			parentId: '',
			parentName: '',
			trombiData: [],
			rolesData: new Map(),
		};

		this.loadDetails();

		this.isUnMounted = false;
	}

	componentWillUnmount() {
		if (this.portail) {
			this.portail.abortRequest();
		}

		this.isUnMounted = true;
	}

	loadRoles = async trombiData => {
		const { rolesData } = this.state;

		if (trombiData && trombiData[0]) {
			// c'est dégueu mais au moins la structure de données est ok
			const roles = new Map();
			const promises = [];

			try {
				trombiData.forEach(person => {
					promises.push(
						new Promise((resolve, _) => {
							this.portail.getAssoRole(this.id, person.pivot.role_id).then(data => {
								roles.set(person.pivot.role_id, data);
								resolve(true);
							});
						})
					);
				});
			} catch (e) {
				console.warn(e);
			}

			if (promises) {
				return Promise.all(promises).then(() => {
					return roles;
				});
			}
		}

		return rolesData;
	};

	loadDetails() {
		const { navigation } = this.props;

		if (this.isUnmounted) {
			return;
		}

		this.id = navigation.getParam('id', 'NO-ID');
		this.portail = navigation.getParam('portailInstance', 'NO-PORTAIL');

		if (this.id === 'NO-ID') {
			throw 'No asso id provided!';
		}

		if (this.portail === 'NO-PORTAIL') {
			throw 'No portail instance provided!';
		}

		this.portail
			.getAssoDetails(this.id)
			.then(data => {
				if (this.isUnmounted) {
					return;
				}
				if (data.parent) {
					this.setState(prevState => ({
						...prevState,
						description: data.description,
						logo: data.image,
						type: data.type.name,
						parentId: data.parent.id,
						parentName: data.parent.shortname,
					}));
				} else {
					// root : pas de parent
					this.setState(prevState => ({
						...prevState,
						description: data.description,
						logo: data.image,
						type: data.type.name,
					}));
				}
			})
			.catch(([response, status]) => {
				this.warn(`Erreur lors de la connexion au portail : ${response} --- ${status}`);
			});

		this.portail.getAssoMembers(this.id).then(trombiData => {
			if (this.isUnmounted) {
				return;
			}

			this.loadRoles(trombiData).then(roles => {
				this.setState(prevState => ({ ...prevState, trombiData, rolesData: roles }));
			});
		});
	}

	warn(text) {
		console.warn(text);

		if (this.isUnmounted) {
			return;
		}

		this.setState(prevState => ({ ...prevState, warn: true, message: text }));
	}

	render() {
		const { description, parentName, type, logo, trombiData, rolesData } = this.state;

		const Tab = createMaterialTopTabNavigator(
			{
				Presentation: {
					screen: () => (
						<PresentationView
							description={description}
							parentName={parentName}
							type={type}
							logo={logo}
						/>
					),
					navigationOptions: () => ({
						title: 'En bref',
					}),
				},
				Articles: {
					screen: ToDoView,
					navigationOptions: () => ({
						title: 'Articles',
					}),
				},
				Events: {
					screen: ToDoView,
					navigationOptions: () => ({
						title: 'Evénements',
					}),
				},
				Trombi: {
					screen: () => <AssoTrombiComponent trombiData={trombiData} rolesData={rolesData} />,
					navigationOptions: () => ({
						title: 'Trombi',
					}),
				},
			},
			{
				tabBarOptions: {
					style: styles.assoTabBar.style,
					labelStyle: styles.assoTabBar.label,
				},
				backBehavior: 'none',
				initialRouteName: 'Presentation',
				order: ['Presentation', 'Articles', 'Events', 'Trombi'],
			}
		);

		return <Tab />;
	}
}

const PresentationView = ({ logo, description, type, parentName }) => (
	<View style={{ flex: 1, backgroundColor: colors.veryLightGray }}>
		<ScrollView
			contentContainerStyle={{
				alignItems: 'center',
				justifyContent: 'flex-start',
				backgroundColor: colors.veryLightGray,
				paddingHorizontal: 30,
			}}
		>
			{logo && (
				<View style={{ height: 100, width: '100%' }}>
					<Image source={{ uri: logo }} resizeMode="contain" style={{ height: 100, margin: 20 }} />
				</View>
			)}
			<View style={{ marginTop: 40 }}>
				<Markdown styles={markdownStyles}>{description}</Markdown>
			</View>

			<Hr style={{ backgroundColor: colors.lightGray }} />

			<Text>{type}</Text>
			<Text>{parentName}</Text>
		</ScrollView>
	</View>
);
