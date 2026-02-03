import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ColisService } from '../../../Core/services/colis.service';
import { SmartLogiLogoComponent } from '../../../Shared/components/smartlogi-logo/smartlogi-logo.component';

@Component({
  selector: 'app-tracking-concept',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SmartLogiLogoComponent],
  template: `
    <div class="tracking-container">
      <!-- Fixed Navigation -->
      <nav class="mc-nav">
        <div class="flex items-center justify-between w-full max-w-7xl mx-auto px-8">
            <div class="cursor-pointer" routerLink="/">
                <app-smartlogi-logo [scale]="0.7"></app-smartlogi-logo>
            </div>
            <button class="mc-btn-back" routerLink="/">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                BACK TO MISSION CONTROL
            </button>
        </div>
      </nav>

      <div class="map-overlay">
        <!-- Search & Status Panel -->
        <div class="status-panel mb-6">
          <div class="panel-header">
            <span class="pulse-dot"></span>
            LIVE NETWORK MONITOR
          </div>

          <!-- Tracking Input -->
          <div class="search-box mb-6">
              <div class="flex gap-2">
                  <input type="text" [(ngModel)]="trackingId" (keyup.enter)="trackPackage()" placeholder="ENTER SHIPMENT ID (e.g. 550e84...)" class="mc-input flex-1">
                  <button (click)="trackPackage()" [disabled]="isLoading" class="mc-btn-action">
                      {{ isLoading ? 'SCANNING...' : 'TRACK' }}
                  </button>
              </div>
              <div *ngIf="error" class="text-red-400 text-[10px] mt-2 font-mono uppercase tracking-wider">
                  ⚠ {{ error }}
              </div>
          </div>

          <!-- Result Display -->
          <div *ngIf="foundColis" class="result-details animate-fade-in">
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="label">STATUS</span>
                  <span class="value" [ngClass]="getStatusColor(foundColis.statut)">
                      {{ foundColis.statut }}
                  </span>
                </div>
                <div class="stat-item">
                  <span class="label">DESTINATION</span>
                  <span class="value">{{ foundColis.villeDestination }}</span>
                </div>
              </div>

              <div class="shipment-list">
                <div class="shipment-item">
                  <div class="flex justify-between items-center mb-1">
                    <span class="id text-cyan-400 font-mono text-[10px]">WEIGHT</span>
                    <span class="text-white text-xs font-bold">{{ foundColis.poids }} KG</span>
                  </div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="id text-cyan-400 font-mono text-[10px]">PRIORITY</span>
                    <span class="text-white text-xs font-bold">{{ foundColis.priorite }}</span>
                  </div>
                  <div class="flex justify-between items-center mb-1 mt-2 border-t border-white/5 pt-2">
                    <span class="id text-cyan-400 font-mono text-[10px]">SENDER</span>
                    <span class="text-white text-xs">{{ foundColis.clientExpediteur?.nom }} {{ foundColis.clientExpediteur?.prenom }}</span>
                  </div>
                   <div class="flex justify-between items-center mb-1">
                    <span class="id text-cyan-400 font-mono text-[10px]">RECIPIENT</span>
                    <span class="text-white text-xs">{{ foundColis.destinataire?.nom }} {{ foundColis.destinataire?.prenom }}</span>
                  </div>
                </div>
              </div>
          </div>

          <!-- Empty State / Instructions -->
          <div *ngIf="!foundColis && !isLoading && !error" class="text-slate-500 text-xs font-mono text-center py-4">
              ENTER A VALID ID TO INITIALIZE SATELLITE TRACKING.
          </div>
          
        </div>

        <!-- Tracking Intelligence Panel (Decorational) -->
        <div class="status-panel secondary-panel">
          <div class="panel-header text-amber-400">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            LIVE TRACKING INTEL
          </div>
          <div class="space-y-4">
            <div class="intel-item">
                <div class="flex justify-between text-[10px] mb-1">
                    <span class="text-slate-300 uppercase font-bold">Convoy Efficiency</span>
                    <span class="text-white">92%</span>
                </div>
                <div class="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div class="bg-amber-500 h-full w-[92%]"></div>
                </div>
            </div>
            <div class="mt-6 border-t border-slate-800 pt-4">
                <p class="text-[9px] text-slate-400 font-mono leading-relaxed">
                    SYSTEM_READY: WAITING_FOR_INPUT...<br>
                    SECURE_LINK: ESTABLISHED<br>
                    NODE: PUBLIC_ACCESS_GATEWAY
                </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mock Map -->
      <div class="mock-map">
        <div class="coordinates">LAT: 48.8566 | LNG: 2.3522 // SYSTEM READY</div>
        <div class="grid-layer"></div>
        <div class="shimmer-layer"></div>
        
        <div class="hub hub-paris" style="top: 35%; left: 50%;"></div>
        <div class="hub hub-ny" style="top: 45%; left: 25%;"></div>
        <div class="hub hub-tokyo" style="top: 55%; left: 85%;"></div>
        
        <svg class="lines-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M50,35 Q35,40 25,45" class="path-anim" />
          <path d="M50,35 Q65,45 85,55" class="path-anim delay-1" />
        </svg>
      </div>

      <div class="concept-footer">
        <div class="flex items-center space-x-6">
            <span class="status-msg">SYSTEM_LINK_ACTIVE</span>
            <span class="status-msg">ENCRYPTION: ENABLED</span>
            <p class="text-slate-500 font-mono text-[9px] tracking-[0.2em] uppercase">Powered by SmartLogi Intelligence Network</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tracking-container {
      height: 100vh;
      background: #010409;
      position: relative;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }

    .map-overlay {
      position: absolute;
      top: 100px; /* moved up slightly */
      left: 40px;
      z-index: 10;
      width: 380px; /* slightly wider */
    }

    .status-panel {
      background: rgba(13, 17, 23, 0.9);
      backdrop-filter: blur(30px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-left: 4px solid #22d3ee;
      padding: 30px;
      border-radius: 4px;
      box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    }
    
    .mc-input {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: white;
        padding: 8px 12px;
        font-family: monospace;
        font-size: 11px;
        border-radius: 4px;
        outline: none;
        transition: all 0.2s;
    }
    .mc-input:focus {
        border-color: #22d3ee;
        background: rgba(34, 211, 238, 0.05);
    }
    
    .mc-btn-action {
        background: #22d3ee;
        color: #000;
        font-weight: 800;
        font-size: 10px;
        padding: 0 16px;
        border-radius: 4px;
        letter-spacing: 0.1em;
        transition: all 0.2s;
    }
    .mc-btn-action:hover {
        background: #67e8f9;
        box-shadow: 0 0 15px rgba(34, 211, 238, 0.4);
    }
    .mc-btn-action:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .secondary-panel {
        border-left-color: #fbbf24;
        background: rgba(13, 17, 23, 0.7);
    }

    .panel-header {
      color: #fff;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.2em;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #238636;
      border-radius: 50%;
      margin-right: 12px;
      box-shadow: 0 0 10px #238636;
      animation: pulse 2s infinite;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
    }

    .stat-item .label {
      font-size: 9px;
      color: #484f58;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .stat-item .value {
      color: #fff;
      font-size: 16px;
      font-weight: 900;
      font-family: 'Courier New', Courier, monospace;
    }

    .shipment-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .shipment-item {
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.03);
    }

    .mock-map {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, #0d1117 0%, #010409 100%);
    }

    .grid-layer {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    .coordinates {
      position: absolute;
      bottom: 40px;
      left: 40px;
      color: #484f58;
      font-family: monospace;
      font-size: 9px;
      letter-spacing: 0.1em;
    }

    .hub {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #fff;
      border: 2px solid #010409;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
      z-index: 5;
    }

    .path-anim {
      fill: none;
      stroke: #22d3ee;
      stroke-width: 0.15;
      stroke-dasharray: 1, 1;
      animation: dash 30s linear infinite;
    }

    .lines-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0.2;
    }

    .status-msg {
        color: #484f58;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.1em;
    }

    .concept-footer {
      position: absolute;
      bottom: 40px;
      right: 40px;
      z-index: 10;
    }

    @keyframes dash {
      to { stroke-dashoffset: -20; }
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.4; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .animate-fade-in {
        animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class TrackingConceptComponent implements OnInit {
  trackingId: string = '';
  foundColis: any = null;
  isLoading: boolean = false;
  error: string = '';

  constructor(private colisService: ColisService) { }

  ngOnInit() {
  }

  trackPackage() {
    if (!this.trackingId.trim()) return;

    this.isLoading = true;
    this.error = '';
    this.foundColis = null;

    this.colisService.trackColisPublic(this.trackingId).subscribe({
      next: (colis) => {
        this.foundColis = colis;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Tracking Error:', err);
        this.error = 'SHIPMENT NOT FOUND OR SYSTEM OFFLINE';
        this.isLoading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'LIVRE') return 'text-green-400';
    if (s === 'EN_TRANSIT' || s === 'EN_STOCK') return 'text-amber-400';
    if (s === 'CREE' || s === 'COLLECTE') return 'text-blue-400';
    return 'text-white';
  }
}

