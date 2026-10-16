let storeInstance = null;
let storePromise = null;

async function getStore() {
    // Eğer instance zaten oluştuysa direkt döndür
    if (storeInstance) {
        return storeInstance;
    }

    // Eğer import işlemi halihazırda devam ediyorsa, aynı promise'i beklet (Race condition önleyici)
    if (!storePromise) {
        storePromise = (async () => {
            try {
                // electron-store v10+ sürümleri ESM olduğu için dinamik import kullanılır
                const StoreModule = await import("electron-store");
                const Store = StoreModule.default || StoreModule;

                storeInstance = new Store({
                    name: "app-settings",
                    defaults: {
                        theme: "light",
                        language: "tr"
                    }
                });

                return storeInstance;
            } catch (error) {
                console.error("electron-store yüklenirken bir hata oluştu:", error);
                storePromise = null; // Hata durumunda tekrar denenebilmesi için sıfırla
                throw error;
            }
        })();
    }

    return await storePromise;
}

module.exports = { getStore };