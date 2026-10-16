const BaseWindow = require("./base.window");
const { app } = require('electron')
const path = require('path');

class MainWindow extends BaseWindow {
    constructor(windowId) {
        super(windowId, {
            width: 920,
            height: 520,
            frame: false,
            transparent: true,
            resizable: false,
            skipTaskbar: false,
            webPreferences: {
                preload: path.join(__dirname, '../preload.js'),
                contextIsolation: true,
                nodeIntegration: false, // Security best practice
            },
        }, {
            isDisposible: false
        })
    }

    async onInit() {
        const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

        if (isDev) {
            this.window.loadURL('http://localhost:4200');
            //this.window.webContents.openDevTools(); // Open DevTools in dev mode
        } else {
            const indexPath = path.join(__dirname, '../../dist/fluxify-desktop/browser/index.html');
            this.window.loadFile(indexPath);
        }

    }
}

module.exports = MainWindow;