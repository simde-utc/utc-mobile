/**
 * Classe abtraite d'intéraction avec des APIs
 * @author Samy Nastuzzi <samy@nastuzzi.fr>
 * @author Romain Maliach-Auguste <r.maliach@live.fr>
 *
 * @copyright Copyright (c) 2018, SiMDE-UTC
 * @license AGPL-3.0
**/

import AbortController from "abort-controller"

export default class Api {
    static GET = 'GET'
    static POST = 'POST'
    static PUT = 'PUT'
    static DELETE = 'DELETE'

    static HEADER_JSON = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }

	static HEADER_FORM_URLENCODED = {
        'Content-Type': 'application/x-www-form-urlencoded',
	}

    static VALID_STATUS = [
        200, 201, 204
    ]

    constructor(url) {
        this.baseUrl = url
    	this.controller = new AbortController()
    	this.signal = this.controller.signal
    }

    serialize(queries) {
        var str = []

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

    call(request, method, queries, body, headers, validStatus, json = false) {
        var parameters = {
            method: method || Api.GET,
            headers: headers || {},
            signal: this.signal
        }

        if (method != 'GET')
            parameters.body = JSON.stringify(body)

	    return new Promise((resolve, reject) => {
            fetch(this.urlWithQueries(this.baseUrl + request, queries), parameters).then((response) => {
                const toReturn = (data) => {
                    if ((validStatus || Api.VALID_STATUS).includes(response.status))
                        return resolve([data, response.status])
                    else
                        return reject([data, response.status])
                }

				if (json)
					return response.json().then(toReturn)
				else
					return response.text().then(toReturn)
			}).catch((e) => {
                return reject([e.message, 523])
            })
        })
    }

	abortRequest() {
		this.controller.abort()
	}
}
