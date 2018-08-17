/**
 * Télécharger des données du portail des associations du BDE-UTC et des services de l'UTC
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
**/

import Api from './Api'
import Storage from './Storage'

import Generate from '../utils/Generate'

export class Portail extends Api {
	static OAUTH = 'oauth/'
	static API_V1 = 'api/v1/'

	static token = {}
	static user = {}

	static notConnectedException = "Tried to call Portail route but not logged in."

	static scopes = [
		'user-create-info-identity-auth-app', // Tout simplement ajouter la connexion application
		'user-create-info-identity-auth-cas', // Ajouter la connexion CAS
		'user-get-info-identity-auth-app',
		'user-get-articles',
		'user-get-calendars',
		'user-get-events'
	]

	constructor() {
		super(process.env.PORTAIL_URL)
	}

	call(request, method, queries, body, validStatus) {
		headers = Api.HEADER_JSON

		if (Object.keys(Portail.token).length !== 0) {
			headers.Authorization = Portail.token.token_type + ' ' + Portail.token.access_token }
		return super.call(request, method, queries, body, headers, validStatus, true)

	}

	isConnected() {
		return Object.keys(Portail.token).length !== 0 && Object.keys(Portail.user).length !== 0
	}

	isActive() {
		return this.isConnected() && Portail.user.is_active
	}

	_checkConnected(needToBeTrue = true) {
		if (this.isConnected() !== needToBeTrue) {throw [Portail.notConnectedException, 523]}
	}

	setData(login, password) {
		return this.login(login, password).then(() => {
			return Storage.setSensitiveData('portail', {
				app_id: login,
				password: password,
				token: Portail.token
			})
		})
	}

	getData() {
		return Storage.getSensitiveData('portail')
	}

	getUser() {
		return Portail.user
	}

	forget() {
		Portail.user = {}
		Portail.token = {}

		return Storage.removeSensitiveData('portail')
	}

	login(login, password) {
		return this.call(
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
		).then(([response, status]) => {
			response.scopes = Portail.scopes
			Portail.token = response

			return this.getUserData(false)
		})
	}

	createInvitedAccount() {
		this._checkConnected(false)

		const app_id = Generate.UUIDv4()

		return this.call(
			Portail.OAUTH + 'token',
			Api.POST,
			{},
			{
				grant_type: 'client_credentials',
				client_id: process.env.PORTAIL_CLIENT_ID,
				client_secret: process.env.PORTAIL_CLIENT_SECRET,
			}
		).then(([response, status]) => {
			response.scopes = Portail.scopes
			Portail.token = response

			return this.call(
				Portail.API_V1 + 'users',
				Api.POST,
				{},
				{
					email: app_id + '@app',
				}
			)
		}).then(([response, status]) => {
			Portail.user = response

			return this.createAppAuthentification(app_id)
		}).then(([response, status]) => {
			return Storage.getSensitiveData('portail')
		}).then((data) => {
			return this.login(data.app_id, data.password)
		})
	}

	createAppAuthentification(app) {
		this._checkConnected()

		const app_id = app || Generate.UUIDv4()
		const password = Generate.key()

		return this.call(
			Portail.API_V1 + 'users/' + Portail.user.id + '/auths',
			Api.POST,
			{},
			{
				name: 'app',
				data: {
					'app_id': app_id,
					password: password
				}
			}
		).then((data) => {
			return this.setData(app_id, password).then(() => {
				return data
			})
		})
	}

	createCasAuthentification(login, password) {
		this._checkConnected()

		return this.call(
			Portail.API_V1 + 'users/' + Portail.user.id + '/auths',
			Api.POST,
			{},
			{
				name: 'cas',
				data: {
					login: login,
					password: password
				}
			}
		)
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
		if (userMustBeConnected) { this._checkConnected() }

		return this.call(
			Portail.API_V1 + 'user'
		).then(([response, status]) => {
			Portail.user = response
		})
	}

	//ne doit PAS être utilisée directement mais via la classe Articles
	getArticles(paginate, page, order, week, timestamp=false) {
		this._checkConnected()

		order = order || ''
		week = week || ''
		week += timestamp && ',timestamp'
		paginate = paginate || ''
		page = page || ''

		return new Promise((resolve, reject) => {
			this.call(
				Portail.API_V1 + 'articles',
				Api.GET,
				{	"paginate": paginate,
					"page": page,
					"order": order,
					"week": week
				}).then( ( [data, status] ) => {
					this.articles = data
					this.lastArticleUpdate = Date.now()
					resolve()
				}).catch( ([response, status]) => {
					reject([response, status])
				})
		})

	}

	getAssos(tree=false, stageDown=0, stageUp=2) {
		//les undefined sont gérés mais pas les strings vides
		if (stageDown == "")  {stageDown = 0}
		if (stageUp == "") {stageUp = 2}
		this._checkConnected()
		tree = tree ? 'tree' : 'flat'
		return new Promise((resolve, reject) => {
			this.call(
				Portail.API_V1 + 'assos',
				Api.GET,
				{	"stages": stageDown + ',' + stageUp + ',' + tree,
				}).then( ( [data, status] ) => {
					resolve(data)
				}).catch( ([response, status]) => {
					reject([response, status])
				})
		})
	}


	getAssoDetails(id=1) {
		//les undefined sont gérés mais pas les strings vides
		if(id == "") {id = 1}
		this._checkConnected()
		return new Promise((resolve, reject) => {
			this.call(
				Portail.API_V1 + 'assos/' + id,
				Api.GET,
				{}).then( ( [data, status] ) => {
					resolve(data)
				}).catch( ([response, status]) => {
					reject([response, status])
				})
		})
	}


	getEvents(month) {
		this._checkConnected()

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
		this._checkConnected()

		return this.call(
			Portail.API_V1 + 'events/' + event_id,
			Api.GET,
		)
	}

	getEventsFromCalendar(calendar_id, month) {
		this._checkConnected()

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
		this._checkConnected()

		return this.call(
			Portail.API_V1 + 'user/calendars',
			Api.GET,
		)
	}
}

export default new Portail()
