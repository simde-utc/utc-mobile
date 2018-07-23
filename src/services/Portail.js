import Api from './Api'

export class Portail extends Api {
    static OAUTH = 'oauth/'
    static API_V1 = 'api/v1/'

    static token = {}
    static user = {}

    constructor () {
        super(process.env.PORTAIL_URL)
    }

    call (request, method, queries, body, validStatus) {
        headers = Api.HEADER_JSON

        if (Object.keys(Portail.token).length !== 0)
            headers.Authorization = Portail.token.token_type + ' ' + Portail.token.access_token

        return super.call(request, method, queries, body, headers, validStatus)
    }

    isConnected() {
        return (Object.keys(Portail.token).length !== 0) && (Object.keys(Portail.user).length !== 0)
    }

    getUser() {
        return Portail.user
    }

    // Définitions des routes:
    login (emailOrLogin, password) {
        return this.call(
            Portail.OAUTH + 'token',
            Api.POST,
            {},
            {
                grant_type: 'password',
                client_id: process.env.PORTAIL_CLIENT_ID,
                client_secret: process.env.PORTAIL_CLIENT_SECRET,
                username: emailOrLogin,
                password: password,
                scope: ''
            }
        ).then(([response, status]) => { // Si on a une 20x
            Portail.token = response
            // Peut-être chercher les infos user ?
            return this.getUserData()
        }).catch(() => console.log("Les informations entrées sont incorrectes")) // Si on a une erreur d'entrée
    }

    getUserData () {
        return this.call(
            Portail.API_V1 + 'user',
        ).then(([response, status]) => Portail.user = response
        ).catch(() => console.log("Une erreur a été rencontré lors de la récupération du login"))
    }
}

export default new Portail()
