import Api from './Api';

const tokenURL = "http://192.168.56.1/utcnotif/token/"

export class Token extends Api {

    static TOKEN_HEADERS = { ...Api.HEADERS_JSON };

    constructor() {
		super(tokenURL);
	}

    call(request, method, queries, body, validStatus) {

		return super
			.call(request, method, queries, body, Portail.PORTAIL_HEADERS, validStatus, true)
			.catch(([data, status]) => {
				// On gère le cas où on a plus de rien à retourner.
				if (status === 416) {
					return [[], status];
				}

				throw [data, status];
			});
	}

    getTokens(id = 1){
        return new Promise((resolve, reject) => {
            this.call(`read.php`, Api.GET)
            .then(([data]) => {
                resolve(data);
            })
            .catch(([response, status]) => {
                reject([response,status]);
            });
        });
    }
}
