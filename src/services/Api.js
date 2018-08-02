export default class Api {
    static GET = 'GET'
    static POST = 'POST'
    static PUT = 'PUT'
    static DELETE = 'DELETE'

    static HEADER_JSON = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }

    static VALID_STATUS = [
        200, 201, 204
    ]

    constructor(url) {
        this.baseUrl = url
    }

    serialize(queries) {
        var str = [];

        for (var query in queries) {
            if (queries.hasOwnProperty(query))
                str.push(encodeURIComponent(query) + "=" + encodeURIComponent(queries[query]))
        }

        return str.join("&")
    }

    urlWithQueries(url, queries) {
        if (queries === undefined || queries.length === 0 || queries == "")
            return url
	else
        return url + '?' + this.serialize(queries)
    }

    call(request, method, queries, body, headers, validStatus) {
        return fetch(this.urlWithQueries(this.baseUrl + request, queries), {
            method: method || Api.GET,
            headers: headers || {},
            body: JSON.stringify(body)
        })
        .then(response => Promise.all([ response.json(), response.status ]))
        .catch(response => Promise.reject(["Uncaught network error", 523]))
        .then(([ response, status ]) => {
            if ((validStatus || Api.VALID_STATUS).includes(status))
                return Promise.all([response, status])
            else
                return Promise.reject([response, status])
        })
    }
}
