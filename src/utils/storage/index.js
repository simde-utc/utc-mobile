import { AsyncStorage } from "react-native";
import * as Keychain from 'react-native-keychain';

export default class Storage {

constructor() {

}



writeData = async (key, value) => {

	value = value || "";
	
	if(key == null) {
		throw "Clef non définie!";
	}
		try {
			await AsyncStorage.setItem(key, value);
		}
		catch (error) {
			console.log("Erreur lors de l'écriture d'une préférence.");
			throw "Erreur lors de l'écriture d'une préférence."
		}
	

}	


readData = async (key) => {
if(key == null) {throw "Clef non définie!";}

  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
	  return new Promise(resolve => {
	      resolve(value);
	  });
    }
   } catch (error) {
	return new Promise(reject => {
	      reject("Erreur lors de la lecture d'une préférence.");
	  });
	
   }
}


setSensitiveData = async (key, value) => {
console.log("pas encore implémenté");
throw "pas encore implémenté";
	try {
	  await Keychain.setGenericPassword(key, value);				
	}
	catch (error) {
		console.log("Erreur lors de l'écriture d'une donnée sensible.");
		throw "Erreur lors de l'écriture d'une donnée sensible."
	}	
}


	

}
