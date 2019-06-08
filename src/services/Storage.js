/**
 * Permet de gérer les données stockées localement
 * @author Alexandre Brasseur <alexandre.brasseur@etu.utc.fr>
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
**/

import { AsyncStorage } from "react-native";
import { SecureStore } from "expo-secure-store";

class Storage {

	// ========== Normal Storage ==========

	getItem = async (key) => {
		if (!key)	throw "Clé non définie !";

		try {
			const data = await AsyncStorage.getItem(key);
			return this.parseData(data);
		} catch (err) {
			throw "Impossible de récupérer les données"
		}
	}

	setItem = async (key, value) => {
		if (!key)	throw "Clé non définie !";
		if (!value)	throw "Valeur non définie !";

		const data = await this.stringifyData(value)
		return AsyncStorage.setItem(key, data);
	}

	removeItem = async (key) => {
		if (!key)	throw "Clé non définie !";

		return AsyncStorage.removeItem(key);
	}


	// ========== Encrypted Storage ==========

	getSensitiveData = async (key) => {
		if (!key)	throw "Clé non définie !";
		if (!this.checkSensitiveKey(key))
			throw "La clé ne doit contenir que des charactères alphanumeric et ._-";

		try {
			const data = await SecureStore.getItemAsync(key);
			return this.parseData(data, true);
		} catch (err) {
			throw "Impossible de récupérer les données"
		}
	}

	setSensitiveData = async (key, value) => {
		if (!key)	throw "Clé non définie !";
		if (!value)	throw "Valeur non définie !";
		if (!this.checkSensitiveKey(key))
			throw "La clé ne doit contenir que des charactères alphanumeric et ._-";

		const data = await this.stringifyData(value, true)
		return SecureStore.setItemAsync(key, data);
	}

	removeSensitiveData = async (key) => {
		if (!key)	throw "Clé non définie !";
		if (!this.checkSensitiveKey(key))
			throw "La clé ne doit contenir que des charactères alphanumeric et ._-";

		return SecureStore.deleteItemAsync(key);
	}

	// ========== Helpers ==========

	stringifyData = async (data, sensitiveString) => {
		try {
			return JSON.stringify(data);
		} catch (error) {
			console.log("error : ", error)
			throw "Impossible de convertir les données en string."
		}
	}

	parseData = async (data) => {
		try {
			return JSON.parse(data)
		} catch (error) {
			throw  "Impossible de parser les données récupérées."
		}
	}

	// Sensitive keys only contain alphanumeric characters and ._-
	checkSensitiveKey = (key) => /^[\w.\-]+$/.test(key)

}

export default new Storage();
