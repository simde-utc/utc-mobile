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
const MEDIA_URI = 'wp-content/uploads';
const LOGIN_PARAMS = {
	external: 'cas',
	redirect_to: 'wp-json',
};

export class Actualites extends Api {
	connected = false;

	constructor() {
		super(ACTUS_UTC_FEED_LOGIN);
	}

	connect() {
		return CASAuth.getServiceTicket(ACTUS_UTC_FEED_LOGIN + LOGIN_URI, LOGIN_PARAMS).then(
			([ticket]) => {
				if (!ticket) {
					throw 'No tickets !';
				}

				return this.call(LOGIN_URI, Api.GET, {
					...LOGIN_PARAMS,
					ticket,
				})
					.then(() => {
						this.connected = true;

						return true;
					})
					.catch(() => {
						this.connected = false;

						throw false;
					});
			}
		);
	}

	isConnected() {
		return this.connected;
	}

	getArticles(queries) {
		return this.call(`${API_URI}/posts`, Api.GET, queries);
	}

	getMedia(id, queries) {
		return this.call(`${API_URI}/media/${id}`, Api.GET, queries);
	}

	getImageFromMedia(id, queries) {
		return this.getMedia(id, queries).then(([data]) => {
			return `${this.baseUrl}${MEDIA_URI}/${data.media_details.file}`;
		});
	}
}

export default new Actualites();
