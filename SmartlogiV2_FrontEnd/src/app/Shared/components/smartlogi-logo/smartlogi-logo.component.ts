import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-smartlogi-logo',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="logo-container" [style.transform]="'scale(' + scale + ')'">
      <svg class="logo-svg" viewBox="0 0 100 100" fill="none">
        <!-- Modernized Grid/Box Stylized S/L -->
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#22d3ee; stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0ea5e9; stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Outer Frame -->
        <rect x="10" y="10" width="80" height="80" rx="16" stroke="currentColor" stroke-width="2" class="opacity-20" />
        
        <!-- Logistics Path -->
        <path d="M30,50 L50,50 L50,30 L70,30" stroke="url(#logo-gradient)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" />
        <path d="M30,70 L50,70 L50,50" stroke="url(#logo-gradient)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" />
        
        <!-- Tech Dots -->
        <circle cx="30" cy="50" r="4" fill="#fff" />
        <circle cx="70" cy="30" r="4" fill="#fff" />
        <circle cx="30" cy="70" r="4" fill="#fff" />
      </svg>
      <span *ngIf="showText" class="logo-text">SMART<span class="highlight">LOGI</span></span>
    </div>
  `,
    styles: [`
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }
    .logo-svg {
      width: 40px;
      height: 40px;
    }
    .logo-text {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 0.1em;
      color: #fff;
    }
    .highlight {
      color: #22d3ee;
    }
    .opacity-20 { opacity: 0.2; }
  `]
})
export class SmartLogiLogoComponent {
    @Input() scale: number = 1;
    @Input() showText: boolean = true;
}
