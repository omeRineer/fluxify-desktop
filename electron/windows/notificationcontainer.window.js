const { getAccessToken } = require('../services/local/token.manager');
const SignalRService = require("../services/api/signalr.service")
const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const BaseWindow = require('./base.window');


class NotificationContainerWindow extends BaseWindow {
    constructor(windowId) {
        const { width } = screen.getPrimaryDisplay().workArea;
        super(windowId, {
            width: 420,
            height: 400,
            x: width - 420,
            y: 0,
            resizable: false,
            alwaysOnTop: true,
            frame: false,
            transparent: true,
            skipTaskbar: true,
            hasShadow: true,
            webPreferences: {
                nodeIntegration: false,      // Kesinlikle false olmalı
                contextIsolation: true,      // Kesinlikle true olmalı
                preload: path.join(__dirname, '../preload.js') // Preload dosyasının yolu
            }
        })

        this.hub = null;
    }

    async onInit() {
        const token = await getAccessToken();
        if (!this.hub)
            this.hub = new SignalRService(`${process.env.API_ENV}/hub/presence`, token, {
                queryParams: {
                    "Flx-Device-Id": "FLX-DESKTOP",
                    "Flx-Device-Platform": "web"
                }
            });

        const indexPath = path.join(__dirname, '../../dist/fluxify-desktop/browser/index.html');

        this.window.loadFile(indexPath, {
            hash: 'notification-container'
        }).catch(err => {
            console.error(err);
        });
        this.window.setIgnoreMouseEvents(true, { forward: true });

    }

    async onReadyToShow() {
        this.hub.on("ReceiveNotification", (payload) => {
            this.window.webContents.send("toast:on-fire", payload.title, payload.summary)
        })
        await this.hub.connect();
    }

    async onClosed() {
        await this.hub.disconnect();
        this.hub = null;
    }
}


module.exports = NotificationContainerWindow;