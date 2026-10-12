const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    auth: {
        login: (model) => ipcRenderer.invoke("auth:login", model),
        logout: () => ipcRenderer.invoke("auth:logout")
    }
});