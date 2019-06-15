/**
 * Permet de gérer les données stockées localement
 * @author Alexandre Brasseur <alexandre.brasseur@etu.utc.fr>
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
 * */

import { AsyncStorage } from 'react-native';
import CryptoJS from 'crypto-js';
import Generate from '../utils/Generate';

const ENCRYPTION_KEY_NAME = 'encryption_key';

class Storage {
	// ========== Normal Storage ==========

	getItem = async key => {
		if (!key) throw 'Clé non définie !';

		try {
			const data = await AsyncStorage.getItem(key);
			return this.parseData(data);
		} catch (err) {
			throw 'Impossible de récupérer les données';
		}
	};

	setItem = async (key, value) => {
		if (!key) throw 'Clé non définie !';
		if (!value) throw 'Valeur non définie !';

		const data = await this.stringifyData(value);
		return AsyncStorage.setItem(key, data);
	};

	removeItem = async key => {
		if (!key) throw 'Clé non définie !';

		return AsyncStorage.removeItem(key);
	};

	// ========== Encrypted Storage ==========

	getSensitiveData = async key => {
		if (!key) throw 'Clé non définie !';

		try {
			const data = await AsyncStorage.getItem(key);
			const bytes = CryptoJS.AES.decrypt(data, await this.getEncryptionKey());

			return this.parseData(bytes.toString(CryptoJS.enc.Utf8), true);
		} catch (err) {
			throw 'Impossible de récupérer les données';
		}
	};

	setSensitiveData = async (key, value) => {
		if (!key) throw 'Clé non définie !';
		if (!value) throw 'Valeur non définie !';

		const data = await this.stringifyData(value, true);
		const bytes = CryptoJS.AES.encrypt(data, await this.getEncryptionKey());

		return AsyncStorage.setItem(key, bytes.toString());
	};

	removeSensitiveData = async key => {
		if (!key) throw 'Clé non définie !';

		return AsyncStorage.removeItem(key);
	};

	// ========== Helpers ==========

	stringifyData = async data => {
		try {
			return JSON.stringify(data);
		} catch (error) {
			console.log('error : ', error);
			throw 'Impossible de convertir les données en string.';
		}
	};

	parseData = async data => {
		try {
			return JSON.parse(data);
		} catch (error) {
			throw 'Impossible de parser les données récupérées.';
		}
	};

	// Sensitive keys only contain alphanumeric characters and ._-
	checkSensitiveKey = key => /^[\w.-]+$/.test(key);

	// Pour chaque application, une nouvelle clé spéciale est générée pour le chiffrement en interne.
	getEncryptionKey = async () => {
		let key = await this.getItem(ENCRYPTION_KEY_NAME);

		if (!key) {
			key = Generate.key(64);
			await this.setItem(ENCRYPTION_KEY_NAME, key);
		}

		return key;
	};

	// Invalidation des données chiffrées
	invalidateEncrytionData = async () => {
		await this.removeItem(ENCRYPTION_KEY_NAME);
	};
}

export default new Storage();
