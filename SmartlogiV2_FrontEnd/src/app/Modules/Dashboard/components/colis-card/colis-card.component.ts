import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColisResponse } from '../../../../Core/api/models/colis-response';
import { PriorityColorPipe } from '../../../../Shared/pipes/priority-color.pipe';

@Component({
  selector: 'app-colis-card',
  standalone: true,
  imports: [CommonModule, PriorityColorPipe],
  template: `
    <div class="colis-card-glass" (click)="onViewDetails()">
      <!-- Priority Indicator Line -->
      <div class="status-indicator" [style.background-color]="item.priorite | priorityColor"></div>

      <div class="card-content">
        <!-- Header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <span class="text-xs font-mono text-slate-400">#{{ (item.id || '').substring(0,8) }}</span>
            <h3 class="destinataire-title">{{ item.destinataire?.nom }} {{ item.destinataire?.prenom }}</h3>
          </div>
          <div [class]="'badge ' + getStatusClass(item.statut)">
            {{ item.statut || 'Pending' }}
          </div>
        </div>

        <!-- Details -->
        <div class="details-grid">
          <div class="detail-item">
             <label>Weight</label>
             <span>{{ item.poids }} <small>kg</small></span>
          </div>
          <div class="detail-item">
             <label>Destination</label>
             <span class="truncate">{{ item.villeDestination }}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
            <span class="date-label">{{ item.dateCreation | date:'MMM d, HH:mm' }}</span>
            
            <div class="priority-tag">
                <span class="dot" [style.background-color]="item.priorite | priorityColor"></span>
                <span [style.color]="item.priorite | priorityColor" class="font-bold text-xs tracking-wider">
                    {{ item.priorite }}
                </span>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    
    .colis-card-glass {
      position: relative;
      background: rgba(15, 23, 42, 0.6); /* Slate-900 with opacity */
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      height: 100%;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .colis-card-glass:hover {
      transform: translateY(-5px) scale(1.02);
      border-color: rgba(34, 211, 238, 0.3); /* Cyan Glow */
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
    }

    .status-indicator {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 4px;
      opacity: 0.7;
      transition: width 0.3s;
    }
    .colis-card-glass:hover .status-indicator { width: 6px; opacity: 1; }

    .card-content { padding: 1.5rem 1.5rem 1.25rem 1.5rem; }

    .destinataire-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: #f1f5f9; /* Slate-100 */
      margin-top: 0.25rem;
      letter-spacing: -0.025em;
    }

    .badge {
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      letter-spacing: 0.05em;
    }
    .status-delivered { background: rgba(74, 222, 128, 0.15); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.2); }
    .status-transit { background: rgba(96, 165, 250, 0.15); color: #60a5fa; border: 1px solid rgba(96, 165, 250, 0.2); }
    .status-pending { background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.2); }
    .status-default { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 1rem;
    }

    .detail-item label {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b; /* Slate-500 */
      margin-bottom: 0.25rem;
    }

    .detail-item span {
      font-size: 0.95rem;
      color: #e2e8f0; /* Slate-200 */
      font-weight: 500;
    }

    .date-label {
      font-size: 0.75rem;
      color: #64748b;
    }

    .priority-tag {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        box-shadow: 0 0 8px currentColor;
    }
  `]
})
export class ColisCardComponent {
  @Input({ required: true }) item!: ColisResponse;
  @Output() viewDetails = new EventEmitter<ColisResponse>();

  onViewDetails() {
    this.viewDetails.emit(this.item);
  }

  getStatusClass(statut: string | undefined): string {
    if (!statut) return 'status-default';
    const s = statut.toLowerCase();
    if (s.includes('livré') || s.includes('delivered')) return 'status-delivered';
    if (s.includes('transit') || s.includes('collecté')) return 'status-transit';
    if (s.includes('créé') || s.includes('pending') || s.includes('cree')) return 'status-pending';
    return 'status-default';
  }
}
