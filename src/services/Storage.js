import { AsyncStorage } from "react-native";
import { SecureStore } from "expo";

export default class Storage {

	// ========== Normal Storage ==========

	setItem = async (key, value) => {
		if (!key)	throw "Clef non définie!";
		if (!value)	throw "Valeur non définie!";

		return AsyncStorage.setItem(key, value);
	}

	getItem = async (key) => {
		if (!key)	throw "Clef non définie!";

		return AsyncStorage.getItem(key);
	}

	// ========== Encrypted Storage ==========

	setSensitiveData = async (key, value) => {
		if (!key)	throw "Clef non définie!";
		if (!value)	throw "Valeur non définie!";

		console.log("value before", value)
		try {
			const data = JSON.stringify(value);
		} catch (error) {
			return "Impossible de convertir les données en string."
		}
		console.log("value after", data)

		return await SecureStore.setItemAsync(key, data);
	}

	getSensitiveData = async (key) => {
		if (!key)	throw "Clef non définie!";

		const data = await SecureStore.getItemAsync(key);
		try {
			return JSON.parse(data)
		} catch (error) {
			throw  "Impossible de parser les données récupérées."
		}
	}
	

}
