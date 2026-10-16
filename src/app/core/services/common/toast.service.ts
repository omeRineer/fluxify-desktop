import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ToastOptions, ToastRef } from '../../models/common/toast.models';



@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private document = inject(DOCUMENT);
  private container: HTMLElement | null = null;
  private notificationAudio = new Audio("/assets/sounds/notification-sound.mp3");


  // SVG İkon Kütüphanesi
  private readonly icons: Record<string, string> = {
    success: `<svg class="toast-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
    info: `<svg class="toast-icon" viewBox="0 0 24 24"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>`,
    warning: `<svg class="toast-icon" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
    error: `<svg class="toast-icon" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>`,
    chat: `<svg class="toast-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`
  };


  constructor() {
    this.initContainer();
    this.notificationAudio.volume = 0.5;
  }

  private initContainer(): void {
    this.container = this.document.getElementById('custom-toast-container');
    if (!this.container) {
      this.container = this.document.createElement('div');
      this.container.id = 'custom-toast-container';
      this.document.body.appendChild(this.container);
    }
  }

  public fire(options: ToastOptions): ToastRef {
    if (!this.container) this.initContainer();

    if (options.playSound)
      this.sound()

    const {
      title = '',
      message = '',
      type = 'info',
      thumbnail,
      url,
      duration = 4000
    } = options;

    const toast = this.document.createElement('div');
    toast.className = `custom-toast ${type}`;

    toast.addEventListener('mouseenter', ()=>{
      if(window.electronAPI)
        window.electronAPI.window.setIgnoreMouseEvent(false)
    })
    toast.addEventListener('mouseleave', ()=>{
      if(window.electronAPI)
        window.electronAPI.window.setIgnoreMouseEvent(true, { forward: true })
    })

    if (url) {
      toast.classList.add('toast-clickable');
    }

    // Medya içerik seçimi
    let mediaContent = '';
    if (thumbnail) {
      mediaContent = `<img src="${thumbnail}" class="toast-custom-img" alt="toast-img">`;
    } else if (type === 'loading') {
      mediaContent = `<div class="toast-spinner"></div>`;
    } else if (this.icons[type]) {
      mediaContent = this.icons[type];
    }

    toast.innerHTML = `
      <div class="toast-media-wrapper">
        ${mediaContent}
      </div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close-btn">&times;</button>
    `;

    if (url) {
      toast.addEventListener('click', () => {
        window.open(url, '_blank');
      });
    }

    let timer: ReturnType<typeof setTimeout> | null = null;

    if (type !== 'loading' && duration > 0) {
      const progressBar = this.document.createElement('div');
      progressBar.className = 'toast-progress-bar';
      progressBar.style.transition = `transform ${duration}ms linear`;
      progressBar.style.transform = 'scaleX(1)';
      toast.appendChild(progressBar);

      requestAnimationFrame(() => {
        setTimeout(() => {
          progressBar.style.transform = 'scaleX(0)';
        }, 50);
      });

      timer = setTimeout(() => this.dismiss(toast), duration);
    }

    this.container?.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const closeBtn = toast.querySelector('.toast-close-btn');
    closeBtn?.addEventListener('click', (event) => {
      event.stopPropagation();
      if (timer) clearTimeout(timer);
      this.dismiss(toast);
    });

    return {
      close: () => {
        if (timer) clearTimeout(timer);
        this.dismiss(toast);
      }
    };
  }

  public success(message: string, title?: string, options?: Partial<ToastOptions>): ToastRef {
    return this.fire({ ...options, message, title, type: 'success' });
  }

  public error(message: string, title?: string, options?: Partial<ToastOptions>): ToastRef {
    return this.fire({ ...options, message, title, type: 'error' });
  }

  public info(message: string, title?: string, options?: Partial<ToastOptions>): ToastRef {
    return this.fire({ ...options, message, title, type: 'info' });
  }

  public warning(message: string, title?: string, options?: Partial<ToastOptions>): ToastRef {
    return this.fire({ ...options, message, title, type: 'warning' });
  }

  public chat(message: string, title?: string, thumbnail?: string): ToastRef {
    return this.fire({ message, title, type: 'chat', thumbnail });
  }

  public dismiss(toast: HTMLElement): void {
    if (!toast || !toast.parentNode) return;

    window.electronAPI.window.setIgnoreMouseEvent(true)
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }

  sound(): void {
    try {
      this.notificationAudio.currentTime = 0;

      const playPromise = this.notificationAudio.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Bildirim sesi çalınamadı (Autoplay kısıtlaması):', error);
        });
      }
    } catch (err) {
      console.error('Ses dosyası oynatılırken hata oluştu:', err);
    }
  }
}