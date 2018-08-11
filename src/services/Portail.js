import Api from './Api'

export class Portail extends Api {
	static OAUTH = 'oauth/'
	static API_V1 = 'api/v1/'

	static token = {}
	static user = {}

	static notConnectedException = "Tried to call Portail route but not logged in.";

	constructor() {
		super(process.env.PORTAIL_URL || 'http://192.168.56.1:8000/');
	}

	call(request, method, queries, body, validStatus) {

		headers = Api.HEADER_JSON;

		if (Object.keys(Portail.token).length !== 0) {
			headers.Authorization = Portail.token.token_type + ' ' + Portail.token.access_token; }
		return super.call(request, method, queries, body, headers, validStatus, true);

	}

	isConnected() {
		return (Object.keys(Portail.token).length !== 0) && (Object.keys(Portail.user).length !== 0)
	}

	_checkConnected() {
		if (!this.isConnected) {throw [Portail.notConnectedException, 523];}
	}

	getUser() {
		return Portail.user
	}

	// Définitions des routes:
	login(emailOrLogin, password) {
		return new Promise( (resolve, reject) => {
			this.call(
				Portail.OAUTH + 'token',
				Api.POST,
				{},
				{
					grant_type: 'password',
					client_id: process.env.PORTAIL_CLIENT_ID,
					client_secret: process.env.PORTAIL_CLIENT_SECRET,
					username: emailOrLogin,
					password: password,
					scope: 'user-manage-articles'
				}
			).then( ([response, status]) => {
				Portail.token = response;
				this.getUserData(false).then( () => {resolve();});
			}).catch( ([response, status]) => {
				reject([response, status]);
			});
		});
	}

	logout() {
		Portail.user = {}
	}

	getUserData(userMustBeConnected = true) {
		if(userMustBeConnected) {this._checkConnected();}
		return new Promise((resolve, reject) => {
			this.call(
				Portail.API_V1 + 'user'
			).then( ([data, status]) => {
						Portail.user = data;
						resolve();
			}).catch( ([response, status]) => {
						reject([response, status]);
			});
		});

	}
	//ne doit PAS être utilisée directement mais via la classe Articles
	getArticles(paginate, page, order, week, timestamp=false) {

		this._checkConnected();
		order = order || '';
		week = week || '';
		week += timestamp && ',timestamp';
		paginate = paginate || '';
		page = page || '';
		return new Promise((resolve, reject) => {
			this.call(
				Portail.API_V1 + 'articles',
				Api.GET,
				{	"paginate": paginate,
					"page": page,
					"order": order,
					"week": week
				}).then( ( [data, status] ) => {
					this.articles = data;
					this.lastArticleUpdate = Date.now();
					resolve();
				}).catch( ([response, status]) => {
					reject([response, status]);
				});
		});

	}


}

export default new Portail()
