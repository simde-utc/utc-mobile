/**
 * Télécharger des données depuis le WP des actualités internes de l'UTC
 * Cette classe ne doit PAS être utilisée directement, mais via la classe Portail
 *
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
 * */

import Api from './Api';
import CASAuth from './CASAuth';
import { ACTUS_UTC_FEED_LOGIN } from '../../config';

const LOGIN_URI = 'wp-login.php';
const API_URI = 'wp-json/wp/v2';

export class Actualites extends Api {
	connected = false;

	constructor() {
		super(ACTUS_UTC_FEED_LOGIN);
	}

	connect() {
		const ticket = CASAuth.getTicket();

		if (!ticket) {
			throw 'No tickets !';
		}

		return this.call(LOGIN_URI, Api.GET, {
			redirect_to: 'wp-json',
			ticket,
		})
			.then(() => {
				this.connected = true;

				return true;
			})
			.catch(() => {
				this.connected = false;

				throw false;
			});
	}

	isConnected() {
		return this.connected;
	}

	getArticles(queries) {
		return this.call(`${API_URI}/posts`, Api.GET, queries);
	}
	//
	// loadArticles() {
	// 	return this.call(ActualitesUTC.st, Api.GET).then(([response]) => {
	// 		this.articles = Array.from(JSON.parse(response));
	// 		this.articles.forEach(ActualitesUTC.normalizeArray);
	//
	// 		let i = 0;
	// 		this.articles.forEach(article => {
	// 			// fonction pour map id wordpress vers indice article
	// 			this.wpIndexDico.set(article.id, i);
	// 			i++;
	// 		});
	//
	// 		return Promise.all(
	// 			this.articles.map(async article => {
	// 				try {
	// 					article['wp:featuredmedia'] = await this.getFeaturedMediaUrl(
	// 						article['wp:featuredmedia']
	// 					);
	// 				} catch (e) {
	// 					console.warn(e);
	// 				}
	// 				return article;
	// 			})
	// 		).then(result => {
	// 			this.articles = result;
	// 			ActualitesUTC.articlesWereLoaded = true;
	// 		});
	// 	});
	// }
	//
	// articlesWereLoaded() {
	// 	return this.articles !== undefined && ActualitesUTC.articlesWereLoaded;
	// }
	//
	// checkArtLoaded() {
	// 	if (!this.articlesWereLoaded()) {
	// 		throw ActualitesUTC.NO_ARTICLES_LOADED_EXCEPTION;
	// 	}
	// }
	//
	// getArticles(paginate, page, order, week) {
	// 	this.checkArtLoaded();
	//
	// 	let result;
	//
	// 	// On suppose que week est un objet Date natif js
	// 	if (week) {
	// 		result = this.articles.filter(article => {
	// 			// fonction déterminant si l'article est dans le bon intervalle de dates ou pas
	// 			const date = new Date(article.date_gmt);
	// 			const nextweek = new Date(week.getTime() + 604800000);
	// 			return week <= date && date <= nextweek;
	// 		});
	// 	} else {
	// 		result = this.articles;
	// 	}
	//
	// 	if (result.length === 0) {
	// 		throw [[], 416];
	// 	}
	//
	// 	if (paginate === undefined || paginate === null || paginate === '') {
	// 		paginate = result.length;
	// 		page = 1;
	// 	}
	//
	// 	result.sort(this.compArtDate);
	//
	// 	switch (order) {
	// 		case 'latest':
	// 			result.reverse();
	// 			ActualitesUTC.restrainArray(result, (page - 1) * paginate, page * paginate - 1);
	//
	// 			break;
	//
	// 		case 'random':
	// 			if (ActualitesUTC.randomArticlesBucketEmpty) {
	// 				ActualitesUTC.randomArticlesBucket = this.shuffle(result);
	// 				ActualitesUTC.randomArticlesBucketEmpty = false;
	// 			}
	//
	// 			result = [];
	//
	// 			while (result.length < paginate && ActualitesUTC.randomArticlesBucket.length !== 0) {
	// 				result.push(ActualitesUTC.randomArticlesBucket.shift());
	// 			}
	//
	// 			if (ActualitesUTC.randomArticlesBucket.length === 0) {
	// 				ActualitesUTC.randomArticlesBucketEmpty = true;
	// 			}
	//
	// 			break;
	//
	// 		case 'oldest':
	// 		default:
	// 			ActualitesUTC.restrainArray(result, (page - 1) * paginate, page * paginate - 1);
	//
	// 			break;
	// 	}
	//
	// 	return result;
	// }
	//
	// getRandomArticleId() {
	// 	this.checkArtLoaded();
	//
	// 	return this.articles[Math.floor(Math.random() * this.articles.length)].id;
	// }
	//
	// getArticleByWordpressId(id) {
	// 	if (id === undefined) {
	// 		throw 'No id provided!';
	// 	}
	//
	// 	this.checkArtLoaded();
	//
	// 	if (!this.wpIndexDico.has(id) || this.wpIndexDico.get(id) > this.articles.length) {
	// 		throw 'Article unavailable in local cache.';
	// 	}
	//
	// 	return this.articles[this.wpIndexDico.get(id)];
	// }
	//
	// getFeaturedMediaUrl = async url => {
	// 	if (url === undefined) {
	// 		throw 'No url provided';
	// 	}
	//
	// 	const parameters = {
	// 		method: Api.GET,
	// 		cache: 'force-cache',
	// 		credentials: 'include',
	// 	};
	//
	// 	try {
	// 		const response = await fetch(url, parameters);
	//
	// 		if (!Api.VALID_STATUS.includes(response.status)) {
	// 			if (response.status === 401) {
	// 				return null;
	// 			}
	//
	// 			response.text().then(text => {
	// 				throw [text, response.status];
	// 			});
	// 		} else {
	// 			const data = await response.json();
	//
	// 			return data.media_details.sizes.full;
	// 		}
	// 	} catch (e) {
	// 		throw [e.message, 523];
	// 	}
	// };
	//
	// // pure helpers
	// static compArtDate(a, b) {
	// 	const dateA = new Date(a.date_gmt);
	// 	const dateB = new Date(b.date_gmt);
	//
	// 	if (dateA < dateB) {
	// 		return -1;
	// 	}
	//
	// 	if (dateA > dateB) {
	// 		return 1;
	// 	}
	//
	// 	return 0;
	// }
	//
	// static restrainArray(array, a, b) {
	// 	array.splice(b + 1, array.length - b);
	// 	array.splice(0, a);
	// }
	//
	// // pour avoir les mêmes champs que pour les articles portail
	// static normalizeArray(article) {
	// 	for (const champ in article) {
	// 		switch (champ) {
	// 			case 'title':
	// 			case 'content':
	// 				article[champ] = article[champ].rendered;
	// 				break;
	// 			case 'excerpt':
	// 				article[champ] = article[champ].rendered.replace('<p>', '<p style="marginTop: 0">'); // workaround default html rendering
	// 				break;
	//
	// 			case 'id':
	// 			case 'date_gmt':
	// 			case 'link':
	// 			case 'wp:featuredmedia':
	// 				break;
	//
	// 			case '_links':
	// 				article['wp:featuredmedia'] = article[champ]['wp:featuredmedia'][0].href;
	// 				delete article[champ];
	// 				break;
	//
	// 			default:
	// 				delete article[champ];
	// 		}
	// 	}
	// }
	//
	// // algo de fisher-yates, implémenté pour mélanger des array
	// static shuffle(array) {
	// 	let currentIndex = array.length;
	// 	let temporaryValue;
	// 	let randomIndex;
	//
	// 	while (currentIndex !== 0) {
	// 		randomIndex = Math.floor(Math.random() * currentIndex);
	// 		currentIndex -= 1;
	// 		temporaryValue = array[currentIndex];
	// 		array[currentIndex] = array[randomIndex];
	// 		array[randomIndex] = temporaryValue;
	// 	}
	//
	// 	return array;
	// }
}

export default new Actualites();
