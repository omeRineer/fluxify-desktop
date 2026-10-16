const BaseHttpService = require("../common/http.service");

class AuthService extends BaseHttpService {
    constructor() {
        super(`${process.env.API_URL}/webapi/auth`);
    }

    login(model) {
        return this.post("/login", model);
    }
}

module.exports = new AuthService();