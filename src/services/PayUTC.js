/**
 * Service se connectant à PayUTC et affichant le solde.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 * */

import Api from './Api';
import CASAuth from './CASAuth';
import { PAYUTC_API, PAYUTC_KEY, PAYUTC_SYSTEM_ID } from '../../config';

const LOGIN_APP_URI = 'loginApp';
const LOGIN_CAS_URI = 'loginCas2';
const AUTH_QUERIES = {
	system_id: PAYUTC_SYSTEM_ID,
	app_key: PAYUTC_KEY,
};

export class PayUTCApi extends Api {
	connected = false;

	constructor() {
		super(PAYUTC_API);
	}

	connect() {
		return this.call(LOGIN_APP_URI, Api.POST, AUTH_QUERIES, { key: PAYUTC_KEY }).then(() => {
			return CASAuth.getServiceTicket(PAYUTC_API).then(([ticket]) => {
				if (!ticket) {
					throw 'No tickets !';
				}

				return this.call(LOGIN_CAS_URI, Api.POST, AUTH_QUERIES, {
					service: PAYUTC_API,
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
			});
		});
	}

	isConnected() {
		return this.connected;
	}

	getWalletDetails() {
		return this.call('getWalletDetails', Api.POST, AUTH_QUERIES, Api.HEADERS_JSON);
	}
}

export default new PayUTCApi();
