import Api from './Api'

export class Portail extends Api {
    static OAUTH = 'oauth/'

    constructor () {
        super(process.env.PORTAIL_URL)
    }

    call (request, method, queries, body) {
        return super.call(request, method, queries, body, Api.HEADER_JSON)
    }

    // Définitions des routes:
    login (emailOrLogin, password) {
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
                scope: ''
            }
        ).then((response) => console.log(response))
    }
}

export default new Portail()
