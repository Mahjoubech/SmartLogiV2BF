import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading-screen',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="loading-overlay" *ngIf="visible">
      <div class="loader-content">
        <div class="spinner"></div>
        <div class="loading-text">{{ text }}</div>
      </div>
    </div>
  `,
    styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(1, 4, 9, 0.9); /* Dark backdrop */
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
    }

    .loader-content {
      text-align: center;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(34, 211, 238, 0.1);
      border-radius: 50%;
      border-top-color: #22d3ee; /* Cyan */
      animation: spin 1s ease-in-out infinite;
      margin: 0 auto 1.5rem;
      box-shadow: 0 0 15px rgba(34, 211, 238, 0.2);
    }

    .loading-text {
      color: #f0f6fc;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      animation: pulse 2s infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class LoadingScreenComponent {
    @Input() visible: boolean = false;
    @Input() text: string = 'Initializing Mission Control...';
}
