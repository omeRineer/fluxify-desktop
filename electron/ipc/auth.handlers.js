const { ipcMain } = require("electron");
const AuthService = require("../services/api/auth.service");

function registerAuthHandlers() {
    ipcMain.handle("auth:login", async (_event, model) => await AuthService.login(model));
}

module.exports = { registerAuthHandlers };