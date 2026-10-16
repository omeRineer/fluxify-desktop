import { Component, ElementRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../../core/components/spinner.component';

@Component({
  selector: 'app-auth-layout',
  imports: [
    RouterModule,
    SpinnerComponent
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout implements OnInit {
  readonly router = inject(Router)
  readonly isLoading = signal<boolean>(false)
  private el = inject(ElementRef);
  private lastState: boolean | null = null;

  async ngOnInit() {
    this.isLoading.set(true)

    window.electronAPI.auth.check().then(res => {
      this.isLoading.set(false)

      if (!res)
        this.router.navigateByUrl('/login')
      else
        this.router.navigateByUrl('/blank')

    })


  }

  minimize() {
    window.electronAPI.window.minimize();
  }

  close() {
    window.electronAPI.window.close();
  }

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
}
