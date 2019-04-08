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
import CASAuth from './CASAuth';
import ActualitesUTC from './ActualitesUTC';

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
		'user-get-events',
		'user-get-assos',
		'user-create-articles-actions',
		'user-edit-articles-actions-user',
		'user-get-comments-articles',
		'user-set-comments-articles',
		'user-manage-articles-actions-user',
		'user-get-assos-members',
		'user-get-roles-assos-assigned',
		'user-get-roles-assos-owned',
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

	callWithoutJSON(request, method, queries, body, validStatus) {
		headers = Api.HEADER_JSON

		if (Object.keys(Portail.token).length !== 0) {
			headers.Authorization = Portail.token.token_type + ' ' + Portail.token.access_token }
		return super.call(request, method, queries, body, headers, validStatus, false)

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

	autoLogin() {
		return this.getData().then((data) => {
			return this.login(data.app_id, data.password).then((user) => {
				return user
			}).catch(() => {
				return PortailApi.forget()
			})
		})
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

	getArticles(paginate = '', page = '', order = '', week = '') {
		this._checkConnected();

		if (week)
			var week = week + ',timestamp';

		return this.call(
			Portail.API_V1 + 'articles',
			Api.GET,
			{	"paginate": paginate,
				"page": page,
				"order": order,
				"week": week
			}
		);
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

	getUserAssos(forceReload=false) {
		if(!this.isConnected())
			return Promise.reject("Not connected.")
		if(Portail.user.assos == undefined || forceReload)
			return new Promise((resolve, reject) => {
				this.call(
					Portail.API_V1 + 'user/assos',
					Api.GET
				).then( ( [data, status] ) => {
					Portail.user.assos = data
					resolve(data)
				}).catch( ([response, status]) => {
					reject([response, status])
				})
			})
		else{
			return Promise.resolve(Portail.user.assos)
		}
	}


	getAssoDetails(id=1) {
		//les undefined sont gérés mais pas les strings vides
		if(id == "") {id = 1}
		this._checkConnected()
		return new Promise((resolve, reject) => {
			this.call(
				Portail.API_V1 + 'assos/' + id,
				Api.GET,
				{}
			).then( ( [data, status] ) => {
				resolve(data)
			}).catch( ([response, status]) => {
				reject([response, status])
			})
		})
	}

	getAssoMembers(id=1) {
		//les undefined sont gérés mais pas les strings vides
		if(id == "") {id = 1}
		this._checkConnected()
		return new Promise((resolve, reject) => {
			this.call(
				Portail.API_V1 + 'assos/' + id + '/members',
				Api.GET,
				{}).then( ( [data, status] ) => {
					resolve(data)
				}).catch( ([response, status]) => {
					reject([response, status])
				})
		})
	}

	getAssoRole(assoId, roleId) {
		if (!(assoId && roleId)) {throw "assoId & roleId required."}
		this._checkConnected();
		return new Promise((resolve, reject) => {
			this.call(
				Portail.API_V1 + 'roles/' + roleId + '?owner=' + roleId,
				Api.GET,
				{}).then( ( [data, status] ) => {
					resolve(data)
				}).catch( ([response, status]) => {
					reject([response, status])
				})
		})
	}

	getRole(roleId) {
		if (!roleId) throw "roleId is required"
		this._checkConnected();
        return new Promise((resolve, reject) => {
            this.call(
                Portail.API_V1 + 'roles/' + roleId,
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

	getUserArticleActions(uuid) {
		this._checkConnected();

		return this.call(
			Portail.API_V1 + 'user/articles/' + uuid + '/actions/',
			Api.GET,
		)
	}

	getArticleRootComments(uuid) {
		this._checkConnected();

		return this.call(
			Portail.API_V1 + 'articles/' + uuid + '/comments/',
			Api.GET,
		)
	}

	setArticleRootComment(uuid, body, visibilityId) {
		this._checkConnected();

		return this.call(
			Portail.API_V1 + 'articles/' + uuid + '/comments/',
			Api.POST,
			{
				body: body,
				visibility_id : visibilityId,
			}
		)
	}

	getArticleSubComment(artId, commId) {
		this._checkConnected();

		return this.call(
			Portail.API_V1 + 'articles/' + artId + '/comments/' + commId + '/comments/',
			Api.GET,
		)
	}

	setArticleSubComment(artId, commId, body, visibilityId) {
		this._checkConnected();

		return this.call(
			Portail.API_V1 + 'articles/' + artId + '/comments/' + commId + '/comments/',
			Api.POST,
			{
				body: body,
				visibility_id : visibilityId,
			},
		)
	}

	getPortailVisibilities() {
		this._checkConnected();

		return this.call(
			Portail.API_V1 + 'visibilities'
		)

	}

	updateArticleAction(uuid, key, value) {
		this._checkConnected();

		return this.call(
			Portail.API_V1 + 'user/articles/' + uuid + '/actions/' + key,
			Api.PUT,
			{
				value : value,
			},
		)
	}

	createArticleAction(uuid, key, value) {
		this._checkConnected();

		return this.call(
			Portail.API_V1 + 'user/articles/' + uuid + '/actions',
			Api.POST,
			{
				key: key,
				value : value,
			},
		)
	}

	deleteArticleAction(uuid, key) {
		this._checkConnected();

		return this.callWithoutJSON(
			Portail.API_V1 + 'user/articles/' + uuid + '/actions/' + key,
			Api.DELETE,
		)
	}



}

export default new Portail()
