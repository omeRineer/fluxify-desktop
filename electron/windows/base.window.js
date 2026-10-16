const { app, BrowserWindow } = require("electron");
const path = require('path')

class BaseWindow {
    static instances = new Map();
    static getInstance(windowId) {
        return BaseWindow.instances.get(windowId)
    }

    constructor(windowId, options = {}, config = {}) {
        this.window = null;
        this.options = options;
        this.windowId = windowId;
        this.isDisposible = config.isDisposible ?? true;
    }

    async init() {
        if (this.window && !this.window.isDestroyed)
            return this.window;

        this.window = new BrowserWindow({
            icon: path.join(__dirname, '../assets/fluxify.ico'),
            ...this.options
        })

        BaseWindow.instances.set(this.windowId, this)

        this.window.on("ready-to-show", async () => {
            await this.onReadyToShow();
        });

        this.window.on('close', async (_event) => {
            if (!this.isDisposible && !app.isQuitting) {
                _event.preventDefault()
                await this.onClose();
                this.window.hide();
            }
        })

        this.window.on("closed", async (event) => {
            await this.onClosed();
            BaseWindow.instances.delete(this.windowId)
            this.window = null;
        });

        await this.onInit();

        return this.window;
    }

    async onInit() { }
    async onReadyToShow() { }
    async onClose() { }
    async onClosed() { }

    show() {
        if (!this.window || this.window.isDestroyed()) {
            this.init();
        }

        this.window.show();
    }

    hide() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.hide();
        }
    }

    close() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.close();
        }
    }

    focus() {
        if (this.window && !this.window.isDestroyed()) {
            this.window.focus();
        }
    }

    isVisible() {
        return !!this.window &&
            !this.window.isDestroyed() &&
            this.window.isVisible();
    }

    getWindow() {
        return this.window;
    }
}

module.exports = BaseWindow;