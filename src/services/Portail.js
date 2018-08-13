
/**
 * Télécharger des données du portail des associations du BDE-UTC et des services de l'UTC
 * @author Samy Nastuzzi <samy@nastuzzi.fr>, Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2017, SiMDE-UTC
 * @license AGPL-3.0
**/


import Api from './Api'
import Storage from './Storage'

export class Portail extends Api {
	static OAUTH = 'oauth/'
	static API_V1 = 'api/v1/'

	static token = {}
	static user = {}

	static notConnectedException = "Tried to call Portail route but not logged in.";

	static scopes = [
		'user-get-articles',
		'user-get-calendars',
		'user-get-articles'
	]

	constructor() {
		super(process.env.PORTAIL_URL);
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

	forget() {
		Portail.user = {}
		Portail.token = {}

		return Storage.removeSensitiveData('user')
	}

	// Définitions des routes:
	login(login, password) {
		return new Promise( (resolve, reject) => {
			this.call(
				Portail.OAUTH + 'token',
				Api.POST,
				{},
				{
					grant_type: 'password',
					client_id: process.env.PORTAIL_CLIENT_ID,
					client_secret: process.env.PORTAIL_CLIENT_SECRET,
					username: login,
					password: password,
					scope: Portail.scopes.join(' ')
				}
			).then( ([response, status]) => {
				Portail.token = response;

				Storage.setSensitiveData('user', {
					login: login,
					password: password,
					token: response
				})

				return this.getUserData(false).then(() => {
					return resolve()
				})
			}).catch( ([response, status]) => {
				return reject([response, status])
			});

		});
	}

	logout() {
		return this.forget()
	}

	connect(token) {
		if (token)
			Portail.token = token

		return this.getUserData(false)
	}

	getUserData(userMustBeConnected = true) {
		if(userMustBeConnected) {this._checkConnected();}
		return new Promise((resolve, reject) => {
			this.call(
				Portail.API_V1 + 'user'
			).then( ([data, status]) => {
				Portail.user = data;

				resolve()
			}).catch( ([response, status]) => {
				reject([response, status])
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

	getAssos(tree=false, stageDown=0, stageUp=2) {
		//les undefined sont gérés mais pas les strings vides
		if (stageDown == "")  {stageDown = 0;}
		if (stageUp == "") {stageUp = 2;}

		this._checkConnected();
		tree = tree ? 'tree' : 'flat';
		return new Promise((resolve, reject) => {
			this.call(
				Portail.API_V1 + 'assos',
				Api.GET,
				{	"stages": stageDown + ',' + stageUp + ',' + tree,
				}).then( ( [data, status] ) => {
					resolve(data);
				}).catch( ([response, status]) => {
					reject([response, status]);
				});
		});
	}


	getAssoDetails(id=1) {
		//les undefined sont gérés mais pas les strings vides
		if(id == "") {id = 1;}
		this._checkConnected();
		return new Promise((resolve, reject) => {
			this.call(
				Portail.API_V1 + 'assos/' + id,
				Api.GET,
				{}).then( ( [data, status] ) => {
					resolve(data);
				}).catch( ([response, status]) => {
					reject([response, status]);
				});
		});
	}


}

export default new Portail()
