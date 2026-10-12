export {};

declare global{
    interface Window {
        electronAPI: {
            auth: {
                login: (model:{userName:string, password:string}) => Promise<void>;
            };
        };
    }
}