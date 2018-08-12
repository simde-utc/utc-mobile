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
		'user-get-events'
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
				response.scopes = Portail.scopes
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

		// On vérifie si le token a les scopes actuels, en case de mise à jour, on actualise
		if (JSON.stringify(Portail.token.scopes) !== JSON.stringify(Portail.scopes))
			return new Promise.reject()

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

	getEvents(month) {
		this._checkConnected();

		return this.call(
			Portail.API_V1 + 'events',
			Api.GET,
			{
				'order': 'oldest',
				'month': month
			}
		)
	}

	getEvent(event_id) {
		this._checkConnected();

		return this.call(
			Portail.API_V1 + 'events/' + event_id,
			Api.GET,
		)
	}

	getEventsFromCalendar(calendar_id, month) {
		this._checkConnected();

		return this.call(
			Portail.API_V1 + 'calendars/' + calendar_id + '/events',
			Api.GET,
			{
				'order': 'oldest',
				'month': month
			}
		)
	}

	getUserCalendars() {
		this._checkConnected();

		return this.call(
			Portail.API_V1 + 'user/calendars',
			Api.GET,
		)
	}
}

export default new Portail()
