const signalR = require("@microsoft/signalr");
const EventEmitter = require("events");

class SignalRService extends EventEmitter {
    /**
     * @param {string} hubUrl - Bağlanılacak Hub'ın tam URL adresi (örn: https://localhost:1020/hub/presence)
     * @param {string} [token] - Opsiyonel kimlik doğrulama token'ı
     * @param {Object} [options] - Ekstra yapılandırma seçenekleri (headers, queryParams vb.)
     */
    constructor(hubUrl, token = null, options = {}) {
        super();
        this.hubUrl = hubUrl;
        this.token = token;
        this.options = options;
        this.connection = null;

        this.hubHandlers = new Map();
    }

    async connect() {
        if (this.connection) {
            return;
        }

        // Query parametrelerini dinamik olarak oluşturalım
        const queryParams = new URLSearchParams();
        if (this.token) {
            queryParams.append("access_token", this.token);
        }

        // Options içinden gelen ek query parametreleri varsa ekleyelim
        if (this.options.queryParams) {
            for (const [key, value] of Object.entries(this.options.queryParams)) {
                queryParams.append(key, value);
            }
        }

        // URL'yi query string ile birleştirelim
        const queryString = queryParams.toString();
        const fullUrl = queryString ? `${this.hubUrl}?${queryString}` : this.hubUrl;

        console.log(fullUrl)
        // HubConnectionBuilder'ı kuralım
        const builder = new signalR.HubConnectionBuilder()
            .withUrl(fullUrl, {
                // İhtiyaç duyulursa transport veya headers buraya eklenebilir
                ...this.options.transportOptions
            })
            .withAutomaticReconnect()
            .configureLogging(this.options.logLevel || signalR.LogLevel.Information);

        this.connection = builder.build();

        for (const [methodName, callbacks] of this.hubHandlers) {
            for (const callback of callbacks) {
                this.connection.on(methodName, callback);
            }
        }

        // Bağlantı olayları (Event Listeners)
        this.connection.onreconnecting(() => {
            console.log(`[${this.hubUrl}] SignalR bağlantısı yeniden kuruluyor...`);
            this.emit("reconnecting");
        });

        this.connection.onreconnected((connectionId) => {
            console.log(`[${this.hubUrl}] SignalR bağlantısı yeniden kuruldu. Connection ID: ${connectionId}`);
            this.emit("reconnected", connectionId);
        });

        this.connection.onclose((error) => {
            console.log(`[${this.hubUrl}] SignalR bağlantısı kapandı.`, error);
            this.emit("close", error);
            this.connection = null; // Bağlantı koptuğunda referansı sıfırla
        });

        try {
            await this.connection.start();
            console.log(`[${this.hubUrl}] SignalR bağlantısı başarıyla kuruldu.`);
            this.emit("connected");
        } catch (error) {
            console.error(`[${this.hubUrl}] SignalR bağlantı hatası:`, error);
            this.connection = null;
            throw error;
        }
    }

    /**
     * Belirli bir Hub metodunu dinlemek (subscribe olmak) için kullanılır.
     * @param {string} methodName - Dinlenecek metod adı (örn: "ReceiveNotification")
     * @param {Function} callback - Veri geldiğinde çalışacak fonksiyon
     */
    on(methodName, callback) {
        const internalEvents = ["connected", "close", "reconnecting", "reconnected"];

        // Eğer olay dahili bir EventEmitter olayı ise, sadece EventEmitter'a kaydet
        if (internalEvents.includes(methodName)) {
            super.on(methodName, callback);
            return this;
        }

        if (!this.hubHandlers.has(methodName)) {
            this.hubHandlers.set(methodName, new Set());
        }

        this.hubHandlers.get(methodName).add(callback);

        if (this.connection) {
            this.connection.on(methodName, callback);
        }

        super.on(methodName, callback)

        return this;
    }

    /**
     * Hub'a bir mesaj göndermek (invoke etmek) için yardımcı metot.
     * @param {string} methodName - Çağrılacak Hub metot adı
     * @param {...any} args - Metoda gönderilecek parametreler
     */
    async invoke(methodName, ...args) {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            throw new Error("SignalR bağlantısı aktif değil.");
        }
        return await this.connection.invoke(methodName, ...args);
    }

    async disconnect() {
        if (!this.connection) {
            return;
        }

        await this.connection.stop();
        this.connection = null;
        console.log(`[${this.hubUrl}] SignalR bağlantısı manuel olarak kapatıldı.`);
    }

    getConnectionState() {
        return this.connection?.state ?? "Disconnected";
    }
}

module.exports = SignalRService;