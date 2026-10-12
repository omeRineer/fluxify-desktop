let storeInstance;

async function getStore() {
    if (!storeInstance) {
        const { default: Store } = await import("electron-store");

        storeInstance = new Store({
            name: "app-settings",
            defaults: {
                theme: "light",
                language: "tr"
            }
        });
    }

    return storeInstance;
}

module.exports = { getStore };