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

const i18n = {
	getTranslationsFor,
	t: i18nJs.t,
};

export default i18n;
