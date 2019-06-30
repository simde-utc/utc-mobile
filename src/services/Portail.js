/**
 * Télécharger des données du portail des associations du BDE-UTC et des services de l'UTC.
 *
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license GPL-3.0
 */

import { PORTAIL_URL, PORTAIL_CLIENT_ID, PORTAIL_CLIENT_SECRET } from '../../config';

import Api from './Api';
import Storage from './Storage';
import Generate from '../utils/Generate';

export class Portail extends Api {
	static OAUTH = 'oauth/';

	static API_V1 = 'api/v1/';

	static PORTAIL_HEADERS = { ...Api.HEADERS_JSON };

	token = {};

	user = {};

	notConnectedException = 'Tried to call Portail route but not logged in.';

	scopes = [
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
		'user-get-faqs',
		'user-get-contacts-assos',
		'user-get-notifications',
	];

	constructor() {
		super(PORTAIL_URL);
	}

	call(request, method, queries, body, validStatus) {
		if (Object.keys(this.token).length !== 0) {
			Portail.PORTAIL_HEADERS.Authorization = `${this.token.token_type} ${this.token.access_token}`;
		}

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

	callWithoutJSON(request, method, queries, body, validStatus) {
		if (Object.keys(this.token).length !== 0) {
			Portail.PORTAIL_HEADERS.Authorization = `${this.token.token_type} ${this.token.access_token}`;
		}

		return super.call(request, method, queries, body, Portail.PORTAIL_HEADERS, validStatus, false);
	}

	isConnected() {
		return Object.keys(this.token).length !== 0 && Object.keys(this.user).length !== 0;
	}

	isActive() {
		return this.isConnected() && this.user.is_active;
	}

	checkConnected(needToBeTrue = true) {
		if (this.isConnected() !== needToBeTrue) {
			throw [this.notConnectedException, 523];
		}
	}

	setData(login, password) {
		return this.login(login, password).then(() => {
			return Storage.setData('portail', {
				app_id: login,
				password,
				token: this.token,
			});
		});
	}

	/* eslint-disable-next-line class-methods-use-this */
	getData() {
		return Storage.getData('portail');
	}

	getUser() {
		return this.user;
	}

	forget() {
		this.user = {};
		this.token = {};

		return Storage.removeData('portail');
	}

	login(login, password) {
		return this.call(
			`${Portail.OAUTH}token`,
			Api.POST,
			{},
			{
				grant_type: 'password',
				client_id: PORTAIL_CLIENT_ID,
				client_secret: PORTAIL_CLIENT_SECRET,
				username: login,
				password,
				scope: this.scopes.join(' '),
			}
		).then(([data]) => {
			this.token = {
				...data,
				scopes: this.scopes,
			};

			return this.getUserData(false);
		});
	}

	createInvitedAccount() {
		this.checkConnected(false);

		const app_id = Generate.UUIDv4();

		return this.call(
			`${Portail.OAUTH}token`,
			Api.POST,
			{},
			{
				grant_type: 'client_credentials',
				client_id: PORTAIL_CLIENT_ID,
				client_secret: PORTAIL_CLIENT_SECRET,
			}
		)
			.then(([data]) => {
				this.token = {
					...data,
					scopes: this.scopes,
				};

				return this.call(
					`${Portail.API_V1}users`,
					Api.POST,
					{},
					{
						email: `${app_id}@app`,
					}
				);
			})
			.then(([data]) => {
				this.user = data;

				return this.createAppAuthentification(app_id);
			})
			.then(() => {
				return Storage.getData('portail');
			})
			.then(data => {
				return this.login(data.app_id, data.password);
			});
	}

	createAppAuthentification(app) {
		this.checkConnected();

		const app_id = app || Generate.UUIDv4();
		const password = Generate.key();

		return this.call(
			`${Portail.API_V1}users/${this.user.id}/auths`,
			Api.POST,
			{},
			{
				name: 'app',
				data: {
					app_id,
					password,
				},
			}
		).then(([data]) => {
			// On défini la clé de chiffrement retournée par le Portail.
			Storage.setEncryptionKey(data.key);

			return this.setData(app_id, password).then(() => {
				return data;
			});
		});
	}

	createCasAuthentification(login, password) {
		this.checkConnected();

		return this.call(
			`${Portail.API_V1}users/${this.user.id}/auths`,
			Api.POST,
			{},
			{
				name: 'cas',
				data: {
					login,
					password,
				},
			}
		);
	}

	logout() {
		return this.forget();
	}

	connect(token) {
		if (token) this.token = token;

		// On vérifie si le token a les scopes actuels, en case de mise à jour, on actualise
		if (JSON.stringify(this.token.scopes) !== JSON.stringify(this.scopes)) {
			return new Promise.reject('Les scopes ont changés');
		}

		return this.getUserData(false);
	}

	getUserData(userMustBeConnected = true) {
		if (userMustBeConnected) {
			this.checkConnected();
		}

		return this.call(`${Portail.API_V1}user`).then(response => {
			const [data] = response;
			this.user = data;

			return response;
		});
	}

	getAppData(userMustBeConnected = true) {
		if (userMustBeConnected) {
			this.checkConnected();
		}

		return Storage.getData('portail').then(({ app_id }) => {
			return this.call(`${Portail.API_V1}user/auths/app`).then(response => {
				const [data, status] = response;

				for (const key in data) {
					const app = data[key];

					// On retoruve la bonne application parmi toutes celles existantes.
					if (app.app_id === app_id) {
						Storage.setEncryptionKey(app.key);

						return [app, status];
					}
				}

				throw "Impossible de retrouver l'application, wtf ?";
			});
		});
	}

	getArticles(paginate = '', page = '', order = '', week = '') {
		this.checkConnected();

		if (week) {
			week += ',timestamp';
		}

		return this.call(`${Portail.API_V1}articles`, Api.GET, {
			paginate,
			page,
			order,
			week,
		});
	}

	getAssos(tree = false, deleted = false, stageDown = 0, stageUp = 2) {
		// les undefined sont gérés mais pas les strings vides
		if (stageDown === '') {
			stageDown = 0;
		}

		if (stageUp === '') {
			stageUp = 2;
		}

		this.checkConnected();

		tree = tree ? 'tree' : 'flat';
		deleted = deleted ? 'with' : 'without';

		return new Promise((resolve, reject) => {
			this.call(`${Portail.API_V1}assos?deleted=${deleted}`, Api.GET, {
				stages: `${stageDown},${stageUp},${tree}`,
			})
				.then(([data]) => {
					resolve(data);
				})
				.catch(([response, status]) => {
					reject([response, status]);
				});
		});
	}

	getAsso(id) {
		if (!this.isConnected()) {
			return Promise.reject('Not connected.');
		}

		return this.call(`${Portail.API_V1}assos/${id}`, Api.GET);
	}

	getUserAssos(forceReload = false) {
		if (!this.isConnected()) {
			return Promise.reject('Not connected.');
		}

		if (this.user.assos === undefined || forceReload) {
			return new Promise((resolve, reject) => {
				this.call(`${Portail.API_V1}user/assos`, Api.GET)
					.then(([data]) => {
						this.user.assos = data;
						resolve(data);
					})
					.catch(([response, status]) => {
						reject([response, status]);
					});
			});
		}

		return Promise.resolve(this.user.assos);
	}

	getAssoDetails(id = 1) {
		this.checkConnected();

		// les undefined sont gérés mais pas les strings vides
		if (id === '') {
			id = 1;
		}

		return new Promise((resolve, reject) => {
			this.call(`${Portail.API_V1}assos/${id}`, Api.GET, {})
				.then(([data]) => {
					resolve(data);
				})
				.catch(([response, status]) => {
					reject([response, status]);
				});
		});
	}

	getAssoContacts(id = 1) {
		this.checkConnected();

		// les undefined sont gérés mais pas les strings vides
		if (id === '') {
			id = 1;
		}

		return new Promise((resolve, reject) => {
			this.call(`${Portail.API_V1}assos/${id}/contacts`, Api.GET, {})
				.then(([data]) => {
					resolve(data);
				})
				.catch(([response, status]) => {
					reject([response, status]);
				});
		});
	}

	getAssoMembers(id = 1) {
		this.checkConnected();

		// les undefined sont gérés mais pas les strings vides
		if (id === '') {
			id = 1;
		}

		return new Promise((resolve, reject) => {
			this.call(`${Portail.API_V1}assos/${id}/members`, Api.GET, {})
				.then(([data]) => {
					resolve(data);
				})
				.catch(([response, status]) => {
					reject([response, status]);
				});
		});
	}

	getAssoRole(assoId, roleId) {
		if (!(assoId && roleId)) {
			throw 'assoId & roleId required.';
		}
		this.checkConnected();
		return new Promise((resolve, reject) => {
			this.call(`${Portail.API_V1}roles/${roleId}?owner=${roleId}`, Api.GET, {})
				.then(([data]) => {
					resolve(data);
				})
				.catch(([response, status]) => {
					reject([response, status]);
				});
		});
	}

	getRole(roleId) {
		if (!roleId) throw 'roleId is required';
		this.checkConnected();
		return new Promise((resolve, reject) => {
			this.call(`${Portail.API_V1}roles/${roleId}`, Api.GET, {})
				.then(([data]) => {
					resolve(data);
				})
				.catch(([response, status]) => {
					reject([response, status]);
				});
		});
	}

	getEvents(month) {
		this.checkConnected();

		return this.call(`${Portail.API_V1}events`, Api.GET, {
			order: 'oldest',
			month,
		});
	}

	getEvent(event_id) {
		this.checkConnected();

		return this.call(`${Portail.API_V1}events/${event_id}`, Api.GET);
	}

	getEventsFromCalendar(calendar_id, month) {
		this.checkConnected();

		return this.call(`${Portail.API_V1}calendars/${calendar_id}/events`, Api.GET, {
			order: 'oldest',
			month,
		});
	}

	getUserCalendars() {
		this.checkConnected();

		return this.call(`${Portail.API_V1}user/calendars`, Api.GET);
	}

	getUserArticleActions(uuid) {
		this.checkConnected();

		return this.call(`${Portail.API_V1}user/articles/${uuid}/actions/`, Api.GET);
	}

	getArticleRootComments(uuid) {
		this.checkConnected();

		return this.call(`${Portail.API_V1}articles/${uuid}/comments/`, Api.GET);
	}

	setArticleRootComment(uuid, body, visibilityId) {
		this.checkConnected();

		return this.call(`${Portail.API_V1}articles/${uuid}/comments/`, Api.POST, {
			body,
			visibility_id: visibilityId,
		});
	}

	getArticleSubComment(artId, commId) {
		this.checkConnected();

		return this.call(`${Portail.API_V1}articles/${artId}/comments/${commId}/comments/`, Api.GET);
	}

	setArticleSubComment(artId, commId, body, visibilityId) {
		this.checkConnected();

		return this.call(`${Portail.API_V1}articles/${artId}/comments/${commId}/comments/`, Api.POST, {
			body,
			visibility_id: visibilityId,
		});
	}

	getthisVisibilities() {
		this.checkConnected();

		return this.call(`${Portail.API_V1}visibilities`);
	}

	updateArticleAction(uuid, key, value) {
		this.checkConnected();

		return this.call(`${Portail.API_V1}user/articles/${uuid}/actions/${key}`, Api.PUT, {
			value,
		});
	}

	createArticleAction(uuid, key, value) {
		this.checkConnected();

		return this.call(`${Portail.API_V1}user/articles/${uuid}/actions`, Api.POST, {
			key,
			value,
		});
	}

	deleteArticleAction(uuid, key) {
		this.checkConnected();

		return this.callWithoutJSON(
			`${Portail.API_V1}user/articles/${uuid}/actions/${key}`,
			Api.DELETE
		);
	}

	getFAQs() {
		this.checkConnected();

		return new Promise((resolve, reject) => {
			this.call(`${Portail.API_V1}faqs`, Api.GET, {})
				.then(([data]) => {
					resolve(data);
				})
				.catch(([response, status]) => {
					reject([response, status]);
				});
		});
	}

	getFAQ(categoryId) {
		this.checkConnected();

		return new Promise((resolve, reject) => {
			this.call(`${Portail.API_V1}faqs/${categoryId}`, Api.GET, {})
				.then(([data]) => {
					resolve(data);
				})
				.catch(([response, status]) => {
					reject([response, status]);
				});
		});
	}

	getFAQQuestions(categoryId) {
		this.checkConnected();

		return new Promise((resolve, reject) => {
			this.call(`${Portail.API_V1}faqs/${categoryId}/questions`, Api.GET, {})
				.then(([data]) => {
					resolve(data);
				})
				.catch(([response, status]) => {
					reject([response, status]);
				});
		});
	}

	getUserNotifications() {
		this.checkConnected();

		return new Promise((resolve, reject) => {
			this.call(`${Portail.API_V1}user/notifications`, Api.GET, {})
				.then(([data]) => {
					resolve(data);
				})
				.catch(([response, status]) => {
					reject([response, status]);
				});
		});
	}
}

export default new Portail();
