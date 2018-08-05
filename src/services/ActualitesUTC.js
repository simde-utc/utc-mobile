/**
 * Télécharger des données depuis le WP des actualités internes de l'UTC
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
*/

import Api from './Api'

export default class ActualitesUTC extends Api {

	static ACTUS_FEED_LOGIN = 'http://actualites.utc.fr/wp-login.php?external=cas&redirect_to=%2Ffeed&ticket=';

	static HEADERS = {
		"Accept" : "application/xml",
	}

	constructor(st) {
		super(ActualitesUTC.ACTUS_FEED_LOGIN);
		if(!st) {throw "Pas de service ticket!";}
		this._st = st;
		this._loaded = false;
		this._upToDate = false;
	}


	loadArticles() {
			console.log(this._st);
			
			this.call(this._st, Api.GET, '', '', ActualitesUTC.HEADERS).then( ([response, status]) => { // Si on a une 20x
				console.log(response + " --- "+ status);
			}).catch( ([response, status]) => {
				console.log(response + " --- "+ status);
			});
			
	}

	call(request, method, queries, body, headers, validStatus) {
	console.log("getting : ");
	let finalRequest = this.baseUrl + request;
	console.log(finalRequest);
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.onreadystatechange = (e) => {
			if (request.readyState !== 4) {
			    return;
			  }

			  if ((validStatus || Api.VALID_STATUS).includes(request.status)) {
				resolve([request.responseText, request.status]);
			  } else {
				reject([request.responseText, request.status]);
			  }
		};

		request.open((method || Api.GET), finalRequest);
		request.send();
	
	});
    }
}






