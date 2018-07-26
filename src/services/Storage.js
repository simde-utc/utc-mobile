import { AsyncStorage } from "react-native";
import { SecureStore } from "expo";

export default class Storage {

	// ========== Normal Storage ==========

	setItem = async (key, value) => {
		if (!key)	throw "Clef non définie!";
		if (!value)	throw "Valeur non définie!";

		const data = await stringifyData(value)
		return AsyncStorage.setItem(key, data);
	}

	getItem = async (key) => {
		if (!key)	throw "Clef non définie!";

		try {
			const data = await AsyncStorage.getItem(key);
		} catch (err) {
			throw "Impossible de récupérer les données"
		}
		return parseData(data);
	}

	// ========== Encrypted Storage ==========

	setSensitiveData = async (key, value) => {
		if (!key)	throw "Clef non définie!";
		if (!value)	throw "Valeur non définie!";

		try {
			const data = await stringifyData(value)
		} catch (err) {
			throw "Impossible de récupérer les données"
		}
		return SecureStore.setItemAsync(key, data);
	}

	getSensitiveData = async (key) => {
		if (!key)	throw "Clef non définie!";

		const data = await SecureStore.getItemAsync(key);
		return parseData(data);
	}
	
	// ========== JSON Helpers ==========

	stringifyData = async (data) => {
		try {
			return JSON.stringify(value);
		} catch (error) {
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

}
