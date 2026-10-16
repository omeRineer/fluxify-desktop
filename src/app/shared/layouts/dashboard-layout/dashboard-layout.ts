import { Component, ElementRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../../../core/components/spinner.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {
  readonly router = inject(Router)
  private el = inject(ElementRef);
  private lastState: boolean | null = null;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const windowEl = this.el.nativeElement.querySelector('.window');
    if (!windowEl) return;

    const rect = windowEl.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    // Fare .window kutusunun dışındaysa (şeffaf padding boşluğundaysa) true, içindeyse false yap
    const isOutside = x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;

    // Sürekli aynı IPC mesajını gönderip performansı düşürmemek için sadece durum değiştiğinde tetikle
    if (this.lastState !== isOutside) {
      this.lastState = isOutside;
      this.setIgnoreMouseEvent(isOutside);
    }
  }

  setIgnoreMouseEvent(ignore: boolean) {
    if (window.electronAPI)
      window.electronAPI.window.setIgnoreMouseEvent(ignore, { forward: true });
  }

  minimize() {
    window.electronAPI.window.minimize();
  }

  close() {
    window.electronAPI.window.close();
  }
}
