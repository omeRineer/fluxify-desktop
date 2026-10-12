const BaseHttpService = require("../common/http.service");

class AuthService extends BaseHttpService {
    constructor() {
        super("http://193.111.78.161:1020/webapi/auth");
    }

    login(model) {
        return this.post("/login", model);
    }
}

module.exports = new AuthService();