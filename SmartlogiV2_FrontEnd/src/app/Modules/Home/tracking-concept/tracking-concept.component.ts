import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SmartLogiLogoComponent } from '../../../Shared/components/smartlogi-logo/smartlogi-logo.component';

@Component({
  selector: 'app-tracking-concept',
  standalone: true,
  imports: [CommonModule, RouterModule, SmartLogiLogoComponent],
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
        <!-- Main Panel -->
        <div class="status-panel mb-6">
          <div class="panel-header">
            <span class="pulse-dot"></span>
            LIVE NETWORK MONITOR
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="label">ACTIVE FREIGHT</span>
              <span class="value">1,284</span>
            </div>
            <div class="stat-item">
              <span class="label">AVG SPEED</span>
              <span class="value text-cyan-400">84 km/h</span>
            </div>
          </div>
          <div class="shipment-list">
            <div class="shipment-item" *ngFor="let s of shipments">
              <div class="flex justify-between items-center mb-1">
                <span class="id text-cyan-400 font-mono text-[10px]">{{ s.id }}</span>
                <span class="status text-[9px] px-2 bg-green-500/20 text-green-400 rounded">IN TRANSIT</span>
              </div>
              <div class="progress-bar">
                <div class="fill" [style.width.%]="s.progress"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tracking Intelligence Panel -->
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
            <div class="intel-item">
                <div class="flex justify-between text-[10px] mb-1">
                    <span class="text-slate-300 uppercase font-bold">Unit Load Avg</span>
                    <span class="text-white">78%</span>
                </div>
                <div class="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div class="bg-amber-500 h-full w-[78%]"></div>
                </div>
            </div>
            <div class="mt-6 border-t border-slate-800 pt-4">
                <p class="text-[9px] text-slate-400 font-mono leading-relaxed">
                    TRACK_UNIT [TN-442]: ROUTE_FIXED <br>
                    TRACK_UNIT [TN-109]: DELAY_RECALC <br>
                    TRACK_UNIT [TN-772]: ACTIVE_SYNC
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
      top: 120px;
      left: 40px;
      z-index: 10;
      width: 340px;
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
      margin-bottom: 30px;
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
      font-size: 20px;
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

    .progress-bar {
      height: 1px;
      background: #161b22;
      border-radius: 1px;
      overflow: hidden;
    }

    .progress-bar .fill {
      height: 100%;
      background: #22d3ee;
      box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
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
  `]
})
export class TrackingConceptComponent implements OnInit {
  shipments = [
    { id: 'FR-UNIT 9218', progress: 78 },
    { id: 'US-UNIT 0012', progress: 41 },
    { id: 'JP-UNIT 4421', progress: 92 }
  ]

  ngOnInit() {
    console.log('Google Maps API Key identified:', environment.googleMapsApiKey);
  }
}
