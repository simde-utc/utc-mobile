/**
 * Permet de faire de simples générations
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
 * */

import ArticleComponent from '../components/Articles/Article';
import { Articles as tArticles } from './i18n';

const CARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const DEFAULT_LENGTH = 32;

export const key = length => {
	let text = '';

	for (let i = 0; i < (length || DEFAULT_LENGTH); i++)
		text += CARACTERS.charAt(Math.floor(Math.random() * CARACTERS.length));

	return text;
};

export const UUIDv4 = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;

		return v.toString(16);
	});
};

export const searchText = text => {
	return text.replace(/[^A-Za-zÀ-ž0-9-_#]+/g, ' ').replace('  ', ' ');
};

export const searchTagsText = text => {
	return text
		.replace(/[^A-Za-zÀ-ž0-9-_#]+/g, ' ')
		.replace('  ', ' ')
		.replace(' ', ' #')
		.replace('##', '#');
};

export const stringDate = date => date.toISOString().substring(0, 23);

export const normalizeArticle = (article, type) => {
	type = type || article.article_type || ArticleComponent.UTC_ARTICLE_TYPE;

	if (type === ArticleComponent.UTC_ARTICLE_TYPE) {
		article.id = article.index;
		article.description = article.excerpt.rendered.replace(tArticles('to_remove'), '');
		article.title = article.title.rendered;
		article.article_type = ArticleComponent.UTC_ARTICLE_TYPE;
	}

	return article;
};

export default {
	key,
	UUIDv4,
	searchText,
	searchTagsText,
	stringDate,
	normalizeArticle,
};
