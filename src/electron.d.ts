export { };

declare global {
    interface Window {
        electronAPI: {
            window: {
                setIgnoreMouseEvent: (ignore: boolean, options?: { forward: boolean }) => void,
                close: () => void,
                hide: () => void,
                minimize: () => void
            },
            auth: {
                login: (model: { userName: string, password: string }) => Promise<any>;
                logout: () => Promise<boolean>,
                check: () => Promise<boolean>
            },
            toast: {
                onFire: (callback) => () => void;
            }
        };
    }
}