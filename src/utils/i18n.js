/**
 * Ajout de la gestion de la langue.
 * https://whatdidilearn.info/2019/01/20/internationalization-in-react-native.html
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */
import i18nJs from 'i18n-js';

import fr from '../locales/fr.json';
import en from '../locales/en.json';

i18nJs.defaultLocale = 'en';
i18nJs.fallbacks = true;
i18nJs.translations = { en, fr };

export const getTranslationsFor = defaultPath => {
	return (path, params) => {
		return i18nJs.t(`${defaultPath}.${path}`, params);
	};
};

// Retourne un texte avec son premier caractère en majuscule.
export const T = (path, params) => {
	const string = i18nJs.t(path, params);

	return string.charAt(0).toUpperCase() + string.slice(1);
};

// Retourne un mot avec son premier caractère en majuscule.
export const _ = (path, params) => {
	return T(`words.${path}`, params);
};

// Retourne un mot avec son premier caractère en majuscule.
export const e = (path, params) => {
	return i18nJs.t(`errors.${path}`, params);
};

// Liste des screens avec des traductions.
export const AppLoader = getTranslationsFor('screens.AppLoader');
export const Articles = getTranslationsFor('screens.Articles');
export const Associations = getTranslationsFor('screens.Associations');
export const Connected = getTranslationsFor('screens.Connected');
export const Connection = getTranslationsFor('screens.Connection');
export const Events = getTranslationsFor('screens.Events');
export const FAQs = getTranslationsFor('screens.FAQs');
export const Map = getTranslationsFor('screens.Map');
export const Welcome = getTranslationsFor('screens.Welcome');

const i18n = {
	...i18nJs,
	getTranslationsFor,
	T,
	_,
	e,
};

export default i18n;
