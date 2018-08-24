/**
 * Télécharger des données depuis le WP des actualités internes de l'UTC
 * Cette classe ne doit PAS être utilisée directement, mais via la classe Portail
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/

import Api from './Api'

export default class ActualitesUTC extends Api {

	static NO_ARTICLES_LOADED_EXCEPTION = "No articles were loaded!";

	constructor(st) {
		super(process.env.ACTUS_UTC_FEED_LOGIN + "&ticket=");
		if(!st) {throw "Pas de service ticket!";}
		this._st = st;
		this._articlesWereLoaded = false;
		this._randomArticlesBucket = {};
		this._randomArticlesBucketEmpty = true;
		this.wpIndexDico = new Map();
	}


	loadArticles() {
		return this.call(this._st, Api.GET).then(([response, status]) => {
			this.articles = Array.from(JSON.parse(response));
			this.articles.forEach(this.normalizeArray);

			var i = 0;
			this.articles.forEach( (article) => {
					//fonction pour map id wordpress vers indice article
				this.wpIndexDico.set(article["id"], i);
				i++;
			});

			this._articlesWereLoaded = true;
		})
	}

	articlesWereLoaded() {
		return ((this.articles !== undefined) && this._articlesWereLoaded);
	}

	_checkArtLoaded() {
		if (!this.articlesWereLoaded()) {throw ActualitesUTC.NO_ARTICLES_LOADED_EXCEPTION;}
	}

	getArticles(paginate, page, order, week) {
		this._checkArtLoaded();

		if(week) {
		//on suppose que week est un objet Date natif js

			var result = this.articles.filter( (article) => {
				//fonction déterminant si l'article est dans le bon intervalle de dates ou pas
				let date = new Date(article["date_gmt"])
				let nextweek = new Date(week.getTime() + 604800000)
				return ((week <= date) && (date <= nextweek))
			})
		}
		else {var result = this.articles;}

		if(result.length == 0) {throw [[], 416];}

		if(paginate === undefined || paginate === null || paginate == '') {paginate=result.length; page=1;}
		result.sort(this.compArtDate);


		switch (order) {


			case 'latest':
			result.reverse();
			this.restrainArray(result, (page-1)*paginate, page*paginate-1);
			break;

			case 'random':
				if(this._randomArticlesBucketEmpty) {this._randomArticlesBucket = this.shuffle(result); this._randomArticlesBucketEmpty = false;}
				result = [];
				while ((result.length < paginate) && (this._randomArticlesBucket.length !=0))
					{result.push(this._randomArticlesBucket.shift());}
				if(this._randomArticlesBucket.length ==0) {this._randomArticlesBucketEmpty = true;}

			break;

			case 'oldest':
			default:
			this.restrainArray(result, (page-1)*paginate, page*paginate-1);
			break;
		}

		return result;
	}

	getRandomArticleId() {
		this._checkArtLoaded();
		return this.articles[Math.floor(Math.random()*this.articles.length)]["id"];
	}

	getArticleByWordpressId(id) {
		if(id === undefined) {throw "No id provided!";}
		this._checkArtLoaded();
		if ((!this.wpIndexDico.has(id)) || (this.wpIndexDico.get(id) > this.articles.length)) {throw "Article unavailable in local cache.";}
		return this.articles[this.wpIndexDico.get(id)];
	}

	getFeaturedMediaUrl = async function(url) {
		if(url === undefined) {throw "No url provided";}
		this._checkArtLoaded();
		var parameters = {
			method: Api.GET,
			cache : "force-cache"
		}
		try {
		var response = await fetch(url, parameters);
		if (!Api.VALID_STATUS.includes(response.status)) {throw [response.text(), response.status];}
		var data = await response.json();
		return data["media_details"]["sizes"]["full"];
		} catch (e) {
			throw [e.message, 523];
		}
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
		array.splice(b+1, array.length-b);
		array.splice(0, a);
	}

	//pour avoir les mêmes champs que pour les articles portail
	normalizeArray(article, index, array) {
		for (champ in article) {

			switch (champ) {

			case "title":
			case "content":
				article[champ] = article[champ]['rendered'];
				break;
			case "excerpt":
				article[champ] = article[champ]['rendered'].replace('<p>', '<p style="marginTop: 0">'); //workaround default html rendering
			break;

			case "id":
			case "date_gmt":
			case "link":
			case "wp:featuredmedia":
			break;

			case "_links":
				article["wp:featuredmedia"] = article[champ]["wp:featuredmedia"][0]["href"];
				delete article[champ];
			break;

			default:
				delete article[champ];
			}
		}
	}

	//algo de fisher-yates, implémenté pour mélanger des array
	shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;
	  while (0 !== currentIndex) {
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}



}
