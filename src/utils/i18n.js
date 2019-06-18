/**
 * Ajout de la gestion de la langue.
 * https://whatdidilearn.info/2019/01/20/internationalization-in-react-native.html
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */
import i18n from 'i18n-js';

import fr from '../locales/fr.json';
import en from '../locales/en.json';

i18n.defaultLocale = 'en';
i18n.fallbacks = true;
i18n.translations = { en, fr };

export const getTranslationsFor = defaultPath => {
	return (path, params) => {
		return i18n.t(`${defaultPath}.${path}`, params);
	};
};

// Retourne un texte avec son premier caractère en majuscule.
export const T = (path, params) => {
	const string = i18n.t(path, params);

	return string.charAt(0).toUpperCase() + string.slice(1);
};

// Retourne un mot avec son premier caractère en majuscule.
export const _ = (path, params) => {
	return T(`words.${path}`, params);
};

// Retourne un mot avec son premier caractère en majuscule.
export const e = (path, params) => {
	return i18n.t(`errors.${path}`, params);
};

i18n.getTranslationsFor = getTranslationsFor;
i18n.T = T;
i18n._ = _;
i18n.e = e;

export default i18n;
