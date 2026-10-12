export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading' | 'chat';

export class ToastOptions {
  title?: string;
  message: string;
  type?: string;
  thumbnail?: string;
  url?: string;
  duration?: number;
  playSound?: boolean = false;
}

export interface ToastRef {
  close: () => void;
}