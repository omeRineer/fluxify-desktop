import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from '../../core/services/common/toast.service';

@Component({
  selector: 'app-notification-container',
  imports: [],
  templateUrl: './notification-container.html',
  styleUrl: './notification-container.scss',
})
export class NotificationContainer implements OnInit {
  readonly toastService = inject(ToastService)
  private removeListener?: () => void;

  ngOnInit(): void {
    if (this.removeListener) {
      return;
    }

    this.removeListener = window.electronAPI.toast.onFire((title: string, summary: string) => {
      this.toastService.fire({
        title: title,
        message: summary
      })
    })
  }

  setIgnoreMouseEvent(ignore: boolean) {
    if (window.electronAPI)
      window.electronAPI.window.setIgnoreMouseEvent(ignore, { forward: true });
  }
}
