const { ipcMain, BrowserWindow } = require("electron");
const BaseWindow = require('../windows/base.window')
const AuthService = require("../services/api/auth.service");
const { getAccessToken, setAccessToken, removeAccessToken } = require("../services/local/token.manager")
const NotificationContainerWindow = require('../windows/notificationcontainer.window')

function registerAuthHandlers() {
    ipcMain.handle("auth:login", async (_event, model) => {
        const res = await AuthService.login(model);

        if (res.success) {

            setAccessToken(res.data.token);
            const toastWindow = new NotificationContainerWindow('notification-container');
            await toastWindow.init();

            const mainWin = BrowserWindow.fromWebContents(_event.sender);
            if (mainWin && !mainWin.isDestroyed()) {
                mainWin.close();
            }
        }

        return res

    });
    ipcMain.handle("auth:logout", async (_event) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const hasToken = !!await getAccessToken();

            if (hasToken) {
                await removeAccessToken();

                const toastWindow = BaseWindow.getInstance('notification-container');
                await toastWindow.close()
            }

            return true;
        } catch (error) {
            return false;
        }
    })
    ipcMain.handle("auth:check", async (_event) => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const hasToken = !!await getAccessToken();

        if (hasToken) {
            const toastWindow = new NotificationContainerWindow('notification-container');
            await toastWindow.init();

            const mainWin = BrowserWindow.fromWebContents(_event.sender);

            if (mainWin && !mainWin.isDestroyed()) {
                mainWin.close();
            }
        }


        return hasToken;
    });

}

module.exports = { registerAuthHandlers };