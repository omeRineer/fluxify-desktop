const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    window: {
        setIgnoreMouseEvent: (ignore, options) => ipcRenderer.send('core:set-mouse-ignore', ignore, options),
        close: () => ipcRenderer.invoke("window:close"),
        hide: () => ipcRenderer.invoke("window:hide"),
        minimize: () => ipcRenderer.send("window:minimize")
    },
    auth: {
        login: (model) => ipcRenderer.invoke("auth:login", model),
        logout: () => ipcRenderer.invoke("auth:logout"),
        check: () => ipcRenderer.invoke("auth:check")
    },

    toast: {
        onFire: (callback) => {
            const listener = (_event, title, summary) => { callback(title, summary) }
            ipcRenderer.on("toast:on-fire", listener);
            return () => { ipcRenderer.removeListener("toast:on-fire", listener) }
        }
    }
});