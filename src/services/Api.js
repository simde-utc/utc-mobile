export default class Api {
    static GET = 'GET'
    static POST = 'POST'
    static PUT = 'PUT'
    static DELETE = 'DELETE'

    static HEADER_JSON = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }

    constructor (url) {
        this.baseUrl = url
    }

    serialize (queries) {
        var str = [];

        for (var query in queries) {
            if (queries.hasOwnProperty(query))
                str.push(encodeURIComponent(query) + "=" + encodeURIComponent(queries[query]))
        }

        return str.join("&")
    }

    urlWithQueries (url, queries) {
        if (queries.length === 0)
            return url

        return url + '?' + this.serialize(queries)
    }

    call (request, method, queries, body, headers) {
        return fetch(this.urlWithQueries(this.baseUrl + request, queries), {
            method: method || Api.GET,
            headers: headers || {},
            body: JSON.stringify(body)
        }).then((response) => response.json())
            .catch((response) => console.log('A gérer !')) // TODO
    }
}
