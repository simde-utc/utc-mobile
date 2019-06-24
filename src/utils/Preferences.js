/**
 * Permet de gérer les préférences de l'utilisateur.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

const Preferences = {
	SHOW_UTC_ACTUALITIES: true,

	SHOW_ASSOS_ACTUALITIES: true,

	IS_UTC_BDE_MEMBER: true,

	LANG: 'fr',

	USER_SHORTCUTS: [
		{
			type: 'shortcut',
			data: {
				screen: 'Interactions',
				icon: 'interactions',
				lazyTitle: 'interactions',
			},
		},
		{
			type: 'shortcut',
			data: {
				screen: 'Map',
				icon: 'map',
				lazyTitle: 'map',
			},
		},
		{
			type: 'association',
			data: {
				id: '6dff8940-3af5-11e9-a76b-d5944de919ff',
				shortname: 'BDE-UTC',
			},
		},
		{
			type: 'association',
			data: {
				id: '6e105220-3af5-11e9-95ce-1f406c6cfae9',
				shortname: 'SiMDE',
			},
		},
		{
			type: 'association',
			data: {
				id: '77065500-3af5-11e9-86f1-3b537cf9c27f',
				shortname: 'Lightupcity',
			},
		},
	],
};

export default Preferences;
