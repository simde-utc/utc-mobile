/**
 * Télécharger des données depuis le WP des actualités internes de l'UTC
 * Cette classe ne doit PAS être utilisée directement, mais via la classe Articles
 * @serviceCAS "http://actualites.utc.fr/wp-login.php?external=cas&redirect_to=%2Fwp-json%2Fwp%2Fv2%2Fposts"
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
*/

import Api from './Api'

export default class ActualitesUTC extends Api {

	static ACTUS_FEED_LOGIN = 'http://actualites.utc.fr/wp-login.php?external=cas&redirect_to=%2Fwp-json%2Fwp%2Fv2%2Fposts&ticket=';

	static HEADERS = {
		"Accept" : "application/json",
	}

	static NO_ARTICLES_LOADED_EXCEPTION = "No articles were loaded!";

	constructor(st) {
		super(ActualitesUTC.ACTUS_FEED_LOGIN);
		if(!st) {throw "Pas de service ticket!";}
		this._st = st;
		this._articlesWereLoaded = false;
		this._randomArticlesConsumed = {};
		this._randomArticlesBucket = {};
		this._randomArticlesBucketEmpty = true;
	}


	loadArticles() {
			return this.call(this._st, Api.GET, {}, null, ActualitesUTC.HEADERS, Api.validStatus, true).then( ([response, status]) => { 
				this.articles = response;
				this._articlesWereLoaded = true;
			});
	}

	articlesWereLoaded() {
		return ((this.articles !== undefined) && this._articlesWereLoaded);
	}

	_checkArtLoaded() {
		if (!this.articlesWereLoaded()) {throw ActualitesUTC.NO_ARTICLES_LOADED_EXCEPTION;}
	}

	getArticles(paginate, page, order, week, timestamp=false) {
		
		//on suppose que tous les paramètres sont remplis
		//date est un objet Date natif js
		
		var result = [];		

		this._checkArtLoaded();
		for (article in this.articles) {
			let date = new Date(article.date_gmt);
			let nextweek = new Date(week.getTime() + 604800000);
			if ((week <= date) && (date <= nextweek)) {
				result.push(article);
			}
		}
		
		result.sort(compArtDate);
		restrainArray(paginate*page, paginate*(page+1));
		
		return result;				
		
	}

	getRandomArticleId() {
		

	}



	//pure helpers

	compArtDate(a,b) {
	var dateA = new Date(a.date_gmt); var dateB = new Date(b.date_gmt);
	  if (dateA < dateB)
	    return -1;
	  if (dateA > dateB)
	    return 1;
	  return 0;
	}

	restrainArray(array,a,b) {
		array.splice(b+1, array.length-b-1);
		array.splice(0, a);
	}

    
}






