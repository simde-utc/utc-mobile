import Api from './Api'

export default class CASAuth extends Api {

	static CAS_TGT_URL = "https://cas.utc.fr/cas/v1/tickets/";

	static HEADER_FORM_URLENCODED = {
        'Content-Type': 'application/x-www-form-urlencoded',
	}

    constructor(url = CASAuth.CAS_TGT_URL){
	super(url);
	this.tgt = "";
    }

call (request, method, queries, body, headers, validStatus) {

	return new Promise((resolve, reject) => {
		   fetch(
			super.urlWithQueries(this.baseUrl + request, queries),
			{
				method: method || Api.GET,
				headers: headers || {},
				body: super.serialize(body)
			}
			).then( (response) => {
				if ((validStatus || Api.VALID_STATUS).includes(response.status)) {
					response.text().then( (text) => {resolve([text, response.status, response.url]);  } );
				}
				else {
					response.text().then( (text) => { reject([text, response.status, response.url]); }); 
				}
			}).catch( (e) => {reject([e.message, 523, ""]);} );
	});
        
}



isConnected() {
	return this.tgt != "";
}


login(login, passwd) {
	return new Promise((resolve, reject) => {
		this.call(
			"",
			Api.POST,
			"",
			{
		        	username: login,
				password: passwd
			},
			CASAuth.HEADER_FORM_URLENCODED
		).then( ([response, status, url]) => {
			if(status != 201) {reject([response, status, url]);}
			else {this.tgt = this._parseTgt(response); resolve([response, status, url]); }
		}).catch( (e) => {
			if(e instanceof TypeError) {reject([JSON.stringify(e), 523, ""]); }
			else {
				if(Array.isArray(e) && e.length ==3) {
					let a, b, c;
					[a, b, c] = e;
					reject([JSON.stringify(a), JSON.stringify(b), JSON.stringify(c)]); 

				}
				else {reject(["Erreur réseau", 523, ""]);}
			}
			
		});
    });
}

getService(service) {
	return new Promise((resolve, reject) => {
		this.call(
			this.tgt,
			Api.POST,
			"",
			{
		        	service: service
			},
			CASAuth.HEADER_FORM_URLENCODED
		).then( ([response, status, url]) => {
			if(status != 200) {reject([response, status, url]);}
			else { resolve([response, status, url]); }
		}).catch( (e) => {
			if(e instanceof TypeError) {reject([JSON.stringify(e), 523, ""]); }
			else {
				if(Array.isArray(e) && e.length ==3) {
					let a, b, c;
					[a, b, c] = e;
					reject([JSON.stringify(a), JSON.stringify(b), JSON.stringify(c)]); 

				}
				else {reject(["Erreur réseau", 523, ""]);}
			}
			
		});
    });
}




//helpers

_parseTgt(content) {
try{
	let start = content.indexOf('tickets//') + 8;
	let end = content.indexOf('"', start);
	return content.substring(start, end);
}
catch(e) {
	console.log(JSON.stringify(e));
}
}



}
