const { Tray, Menu, app, nativeImage } = require("electron");
const path = require("path");
const { removeAccessToken } = require("../services/local/token.manager")
const BaseWindow = require('../windows/base.window')

let tray = null;
let mainWindow = null;

function createTray(window) {
    mainWindow = window;

    const iconPath = path.join(
        __dirname,
        "../assets",
        "fluxify.ico"
    );

    tray = new Tray(nativeImage.createFromPath(iconPath));

    tray.setToolTip("Fluxify");

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Oturumu Kapat",
            click: async () => {
                await removeAccessToken();
                const notificationContainer = BaseWindow.getInstance('notification-container')
                await notificationContainer.close()
                await mainWindow.show();

            }
        },
        { type: "separator" },
        {
            label: "Çıkış",
            click: () => {
                app.isQuitting = true;
                app.quit()
            }
        }
    ]);

    tray.setContextMenu(contextMenu);

    tray.on("click", () => {
        if (!mainWindow) {
            return;
        }

        if (mainWindow.isVisible()) {
            mainWindow.focus();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    return tray;
}

module.exports = { createTray };