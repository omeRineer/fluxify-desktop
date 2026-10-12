import { Component, input } from "@angular/core";



@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div class="spinner-fixed-container">
        <div class="spinner-container">
          <div class="loading-ring"></div>
          @if (message()) {
            <span class="spinner-text">{{ message() }}</span>
          }
        </div>
      </div>
  `,
  styles: [`
  :host {
    display: contents;
  }
    .spinner-fixed-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 400px; /* Sabit yükseklik değeri */
      width: 100%;
      border-radius: inherit; /* Kartın veya alanın oval köşelerine uyum sağlar */
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    /* Fluxify Mavisi Yüklenme Halkası */
    .loading-ring {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(59, 130, 246, 0.1);
      border-radius: 50%;
      border-top-color: #3b82f6;
      animation: spin 0.8s linear infinite;
    }

    .spinner-text {
      color: #94a3b8;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {

  loading = input<boolean>(false);
  message = input<string>('');
}