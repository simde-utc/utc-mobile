import Api from './Api'

export default class ActualitesUTC extends Api {

	static ACTUS_FEED_LOGIN = 'http://actualites.utc.fr/wp-login.php?external=cas&redirect_to=%2Ffeed&ticket=';
	static PORTAIL_DEBUG = 'http://assos.utc.fr/cas?ticket=';

	constructor(st) {
		super(ActualitesUTC.ACTUS_FEED_LOGIN);
		if(!st) {throw "Pas de service ticket!";}
		this._st = st;
		this._loaded = false;
		this._upToDate = false;
	}


	loadArticles() {
			console.log("!!FETCH!!");
			this.call(this._st, Api.GET).then( ([response, status]) => { // Si on a une 20x
				console.log(response + " --- "+ status);
			}).catch( ([response, status]) => {
				console.log(response + " --- "+ status);
			});
	}

	
	call(request, method, queries, body, headers, validStatus) {
	return new Promise((resolve, reject) => {
	console.log("!!!FETCH : " + this.urlWithQueries(this.baseUrl + request, queries));
	fetch(this.urlWithQueries(this.baseUrl + request, queries), {
            method: method || Api.GET,
            headers: headers || {},
            body: JSON.stringify(body)
        }).then( (response) => {
				if ((validStatus || Api.VALID_STATUS).includes(response.status)) {
					response.text().then( (text) => {resolve([text, response.status]);  } );
				}
				else {
					response.text().then( (text) => { reject([text, response.status]); }); 
				}
			}).catch( (e) => {reject([e.message, 523]);} );

	});
    }


}

