/**
 * Télécharger des données depuis le WP des actualités internes de l'UTC
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

	constructor(st) {
		super(ActualitesUTC.ACTUS_FEED_LOGIN);
		if(!st) {throw "Pas de service ticket!";}
		this._st = st;
		this._loaded = false;
		this._upToDate = false;
	}


	loadArticles() {
			return this.call(this._st, Api.GET, {}, null, ActualitesUTC.HEADERS, Api.validStatus, true).then( ([response, status]) => { 
				this.articles = response;
			});
	}

    
}






