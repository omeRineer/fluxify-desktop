const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { registerAuthHandlers } = require('./ipc/auth.handlers');

// Register IPC handlers for authentication
registerAuthHandlers();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 500,
        frame: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false, // Security best practice
        },
    });

    // For development: load localhost; for production: load built index.html
    const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

    if (isDev) {
        mainWindow.loadURL('http://localhost:4200/login');
        mainWindow.webContents.openDevTools(); // Open DevTools in dev mode
    } else {
        mainWindow.loadFile(path.join(__dirname, 'dist/fluxify-desktop/browser/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});