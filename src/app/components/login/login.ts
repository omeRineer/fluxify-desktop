import { Component, signal } from '@angular/core';
import { catchError, finalize } from 'rxjs';
import { ButtonComponent } from '../../core/components/button.component';
import { FluxifyComponent } from '../../core/components/fluxify.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent extends FluxifyComponent {
  username = signal('');
  password = signal('');
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  async onLogin(): Promise<void> {
    const userNameVal = this.username().trim();
    const passwordVal = this.password().trim();

    if (!userNameVal || !passwordVal) {
      this.errorMessage.set('Lütfen kullanıcı adı ve şifrenizi girin.');
      return;
    }

    this.setLoading(true);

    await window.electronAPI.auth.login({ userName: userNameVal, password: passwordVal })
      .then(res => {
        this.setLoading(false)
        if (res.success)
          this.router.navigateByUrl('/blank')
      })
      .catch((error) => {
        this.setLoading(false)
        this.errorMessage.set('Giriş yapılırken bir hata oluştu.');
      });

  }
}
