/**
 * Télécharger des données depuis le WP des actualités internes de l'UTC
 * Cette classe ne doit PAS être utilisée directement, mais via la classe Portail
 *
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
 * */

import Api from './Api';
import CASAuth from './CASAuth';
import { ACTUS_UTC_FEED_LOGIN } from '../../config';

const LOGIN_URI = 'wp-login.php';
const API_URI = 'wp-json/wp/v2';

export class Actualites extends Api {
	connected = false;

	constructor() {
		super(ACTUS_UTC_FEED_LOGIN);
	}

	connect() {
		CASAuth.getServiceTicket(ACTUS_UTC_FEED_LOGIN).then(([ticket]) => {
			if (!ticket) {
				throw 'No tickets !';
			}

			CASAuth.getService(ACTUS_UTC_FEED_LOGIN).then(data => console.log(data));

			return this.call(LOGIN_URI, Api.GET, {
				external: 'cas',
				redirect_to: 'wp-json',
				ticket,
			})
			.then(data => {
				console.log(data);
				this.connected = true;

				return true;
			})
			.catch(() => {
				this.connected = false;

				throw false;
			});
		});
	}

	isConnected() {
		return this.connected;
	}

	getArticles(queries) {
		return this.call(`${API_URI}/posts`, Api.GET, queries).then(([response, status]) => {
			return [JSON.parse(response), status];
		});
	}
}

export default new Actualites();
