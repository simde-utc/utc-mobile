/**
 * Affiche la liste des assos en fonction de données du portail
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
 * */

import React from 'react';
import { View } from 'react-native';

import PortailApi from '../../services/Portail';

import AssosListComponent from '../../components/Assos/AssosList';

export default class AssosScreen extends React.Component {
	// Commenté pour être plus cohérent avec le nouveau menu de Navigation, je reviendrai dessus avec la refonte de la page des Assos
	// Le Header est créé directement dans la vue Navigation
	/*
  static navigationOptions = ({ navigation, navigationOptions }) => {
	//ce qui se passe ici est très très sale Samy <3
	var name = navigation.getParam('name', 'Associations');
	var foreColor = colors.white;
	var color = '';
	var margin = 0;
	switch (name) {
		case 'Bureau des Etudiants':
			color = colors.bdeBack;
			break;
		case 'Pôle Artistique et Évènementiel':
		case 'Pôle Artistique et Événementiel':
			//si on faisait du REST j'aurais pas besoin de tenir compte des fautes de frappe du seed Samy
			color = colors.paeBack;
			break;
		case 'Pôle Solidarité Et Citoyenneté':
			color = colors.psecBack;
			break;
		case 'Pôle Technologie et Entreprenariat':
			color = colors.pteBack;
			break;
		case 'Pôle Vie de Campus':
			color = colors.pvdcBack;
			break;
		case 'Associations':
		default:
			color = colors.white;
			foreColor = colors.gray;
			margin = 15;
			break;
	}
    return {
	title: name,
	headerTintColor: foreColor,
	headerMode: 'float',
	headerStyle: {
		backgroundColor: color,
	},
	headerTitle: <Text style={{color: foreColor, marginLeft: margin}} adjustsFontSizeToFit={true}>{name}</Text>,
    };
  }; */

	constructor(props) {
		super(props);

		this.assos = {};
		this.portailInstance = props.navigation.getParam('portailInstance', 'NO-PORTAIL');

		this.state = {
			log: '',
			list: 'WAIT_LOADING',
		};
	}

	componentDidMount() {
		this.loadAssos();
	}

	componentWillUnmount() {
		if (PortailApi !== undefined) {
			PortailApi.abortRequest();
		}

		this.isUnMounted = true;
	}

	loadAssos = async () => {
		const { navigation } = this.props;

		try {
			let iAmChild = navigation.getParam('isChild', 'NO-CHILD');
			if (iAmChild !== true) {
				iAmChild = false;
			}
			if (iAmChild) {
				const data = navigation.getParam('data', 'NO-DATA');
				if (data === 'NO-DATA') {
					throw "Requested child asso display, but didn't provide asso data via navigation.";
				}
				this.assos = data;
			} else {
				if (this.isUnMounted) {
					return;
				}
				if (!PortailApi.isConnected()) {
					this.log('Erreur de connexion au portail!', true);
					return;
				}

				if (this.isUnMounted) {
					return;
				}
				this.assos = await PortailApi.getAssos(true, 0, 2);
			}

			if (this.isUnMounted) {
				return;
			}
			const assoFolderVisibility = navigation.getParam('showItSelf', '');
			this.setState(prevState => ({
				...prevState,
				list: this.assos,
				child: iAmChild,
				showItSelf: assoFolderVisibility,
			}));
		} catch (e) {
			this.log(e, true);
		}
	};

	log(data, error = false) {
		if (this.isUnMounted) {
			return;
		}
		this.setState(prevState => ({ ...prevState, log: data }));
		if (error) console.warn(data);
		else console.log(data);
	}

	render() {
		const { list, child, showItSelf } = this.state;

		return (
			<View style={{ flex: 1 }}>
				<AssosListComponent
					data={list}
					isChild={child}
					showItSelf={showItSelf}
					portailInstance={
						this.portailInstance !== 'NO-PORTAIL' && this.portailInstance.isConnected()
							? this.portailInstance
							: PortailApi
					}
				/>
			</View>
		);
	}
}
