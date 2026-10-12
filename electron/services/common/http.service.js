const { getAccessToken } = require("../local/token.manager");

class BaseHttpService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl.replace(/\/+$/, "");
    }

    async get(endpoint, options = {}) {
        return this.request("GET", endpoint, {
            ...options
        });
    }

    async post(endpoint, body, options = {}) {
        return this.request("POST", endpoint, {
            ...options,
            body
        });
    }

    async put(endpoint, body, options = {}) {
        return this.request("PUT", endpoint, {
            ...options,
            body
        });
    }

    async patch(endpoint, body, options = {}) {
        return this.request("PATCH", endpoint, {
            ...options,
            body
        });
    }

    async delete(endpoint, options = {}) {
        return this.request("DELETE", endpoint, {
            ...options
        });
    }

    async request(method, endpoint, options = {}) {
        const {
            body,
            headers = {},
            auth = true,
            signal
        } = options;

        const url = `${this.baseUrl}/${endpoint.replace(/^\/+/, "")}`;

        const requestHeaders = {
            Accept: "application/json",
            ...headers
        };

        if (auth) {
            const token = getAccessToken();

            if (token) {
                requestHeaders.Authorization = `Bearer ${token}`;
            }
        }

        let requestBody;

        if (body !== undefined) {
            if (body instanceof FormData) {
                requestBody = body;
            } else {
                requestHeaders["Content-Type"] = "application/json";
                requestBody = JSON.stringify(body);
            }
        }

        let response;

        try {
            response = await fetch(url, {
                method,
                headers: requestHeaders,
                body: requestBody,
                signal
            });
        } catch (error) {
            if (error.name === "AbortError") {
                throw error;
            }

            throw new Error(`API bağlantı hatası: ${error.message}`);
        }

        const contentType = response.headers.get("content-type") ?? "";

        let data = null;

        if (response.status !== 204) {
            if (contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }
        }

        if (!response.ok) {
            const error = new Error(
                data?.message ??
                data?.title ??
                `HTTP ${response.status}: ${response.statusText}`
            );

            error.status = response.status;
            error.data = data;

            throw error;
        }

        return data;
    }
}

module.exports = BaseHttpService;