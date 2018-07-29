import Api from './Api'

export class CASAuth extends Api {
    static CAS_TGT_URL = "https://cas.utc.fr/cas/v1/tickets";

	static HEADER_FORM_URLENCODED = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    constructor() {
	this.tgt = "";
        super(CAS_TGT_URL);
    }

    call(request, method, queries, body, validStatus) {



        return super.call(request, method, queries, body, headers, validStatus)
    }

	call(request, method, queries, body, headers, validStatus) {
        return fetch(this.urlWithQueries(this.baseUrl + request, queries), {
            method: method || Api.GET,
            headers: headers || {},
            body: serialize(body)
        })
        .then(response => Promise.all([ response.text, response.status, response.url ]))
        .catch(response => console.log('A gérer !')) // TODO
        .then(([ response, status, url ]) => {
            if ((validStatus || Api.VALID_STATUS).includes(status))
                return Promise.all([response, status, url])
            else
                return Promise.reject([response, status, url])
        })
    }



    isConnected() {
        return this.tgt != "";
    }


    // Définitions des routes:
    login(login, password) {
        return this.call(
            CAS_TGT_URL,
            Api.POST,
            {},
            {
                service: login,
            },
	HEADER_FORM_URLENCODED
        ).then(([response, status, url]) => { 
		if(status != 201) {return Promise.reject([response, status, url]);} else {this.tgt = url; Promise.resolve([response, status, url]);}
	
        })
    }



    getService(service) {
	if(!isConnected()) {throw "Not connected to CAS.";}
	return this.call(
            this.tgt,
            Api.POST,
            {},
            {
                service: service
            },
	HEADER_FORM_URLENCODED
        ).then(([response, status, url]) => { 
		if(status != 200) {return Promise.reject([response, status, url]);} else {Promise.resolve(response);}
	
        })
}
}

export default new Portail()
