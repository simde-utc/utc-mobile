import { AsyncStorage } from "react-native";
import { SecureStore } from "expo";

class Storage {

	// ========== Normal Storage ==========

	getItem = async (key) => {
		if (!key)	throw "Clef non définie!";

		try {
			const data = await AsyncStorage.getItem(key);
			return this.parseData(data);
		} catch (err) {
			throw "Impossible de récupérer les données"
		}
	}

	setItem = async (key, value) => {
		if (!key)	throw "Clef non définie!";
		if (!value)	throw "Valeur non définie!";

		const data = await this.stringifyData(value)
		return AsyncStorage.setItem(key, data);
	}


	// ========== Encrypted Storage ==========

	getSensitiveData = async (key) => {
		if (!key)	throw "Clef non définie!";

		try {
			const data = await SecureStore.getItemAsync(key);
			return this.parseData(data);
		} catch (err) {
			throw "Impossible de récupérer les données"
		}
	}

	setSensitiveData = async (key, value) => {
		if (!key)	throw "Clef non définie!";
		if (!value)	throw "Valeur non définie!";

		const data = await this.stringifyData(value)
		return SecureStore.setItemAsync(key, data);
	}
	

	// ========== JSON Helpers ==========

	stringifyData = async (data) => {
		// TODO : set entier
		console.log(typeof data)
		try {
			if (typeof data === 'string')
				return data		
			return JSON.stringify(data);
		} catch (error) {
			console.log("error : ", error)
			throw "Impossible de convertir les données en string."
		}
	}

	parseData = async (data) => {
		// TODO : récupération text simple et entier
		try {
			return JSON.parse(data)
		} catch (error) {
			console.log("error : ", error)
			throw  "Impossible de parser les données récupérées."
		}
	}

}

export default new Storage();