const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const dotenv = require('dotenv')
const { registerAuthHandlers } = require('./ipc/auth.handlers');
const { createTray } = require('./core/tray')
const MainWindow = require('./windows/main.window')

const currentEnv = process.env.APP_ENV || 'development';

let envPath = null;
if (app.isPackaged)
    envPath = path.resolve(process.resourcesPath, 'environments', `.env.${currentEnv}`)
else
    envPath = path.resolve(process.cwd(), 'environments', `.env.${currentEnv}`)

dotenv.config({ path: envPath })

registerAuthHandlers();

app.whenReady().then(async () => {
    let mainWin = new MainWindow('main');

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            mainWin = new MainWindow('main');
    });

    await mainWin.init();

    app.setLoginItemSettings({
        openAtLogin: true,
        path: app.getPath('exe'),
    });
    createTray(mainWin)
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on("core:set-mouse-ignore", (event, ignore) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    if (window && !window.isDestroyed()) {
        window.setIgnoreMouseEvents(ignore, { forward: true });
    }
});

ipcMain.handle("window:close", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)

    if (window && !window.isDestroyed())
        window.close();
})

ipcMain.handle("window:hide", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)

    if (window && !window.isDestroyed())
        window.hide();
})

ipcMain.on("window:minimize", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)

    if (window && !window.isDestroyed())
        window.minimize();
})