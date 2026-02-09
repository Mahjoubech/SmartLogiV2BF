import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ColisService } from '../../../../Core/services/colis.service';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-manager-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-overview.component.html',
  styleUrl: './manager-overview.component.css'
})
export class ManagerOverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  
  stats = {
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    delayed: 0
  };

  alerts: any[] = [];
  isLoading = true;
  private dataSubscription: Subscription | null = null;
  private charts: any[] = [];

  constructor(private readonly colisService: ColisService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.refreshData();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
        this.dataSubscription.unsubscribe();
    }
    this.charts.forEach(c => c.destroy());
  }

  refreshData() {
    this.isLoading = true;
    
    this.dataSubscription = forkJoin({
        dashboard: this.colisService.getDashboardStats(),
        parcels: this.colisService.getAllColis(0, 100)
    }).subscribe({
        next: (data) => {
            this.processStats(data.dashboard);
            this.generateAlerts(data.parcels);
            setTimeout(() => this.renderCharts(data.dashboard), 0);
            this.isLoading = false;
        },
        error: (err) => {
            console.error('Failed to load manager dashboard data', err);
            this.isLoading = false;
            this.loadFallbackMock();
        }
    });
  }

  private processStats(apiStats: any) {
      if (!apiStats || !apiStats.stats) return;
      const core = apiStats.stats;
      this.stats = {
          total: core.TOTAL || 0,
          pending: (core.CREE || 0) + (core.EN_STOCK || 0),
          inTransit: (core.COLLECTE || 0) + (core.EN_TRANSIT || 0),
          delivered: core.LIVRE || 0,
          delayed: core.DELAYED || 0
      };
  }

  private generateAlerts(parcelsData: any) {
      const parcels = parcelsData.content || parcelsData;
      if (!Array.isArray(parcels)) return;

      this.alerts = [];
      
      
      const critical = parcels.filter(p => p.priorite === 'URGENT' || p.prioriteStatus === 'URGENT');
      critical.slice(0, 2).forEach(p => {
          this.alerts.push({
              id: Math.random(),
              message: `Urgence: Colis #${p.id?.substring(0,8).toUpperCase()} nécessite une attention immédiate.`,
              type: 'high'
          });
      });

      
      const unassigned = parcels.filter(p => !p.livreur && (p.status === 'CREE' || p.status === 'EN_STOCK'));
      if (unassigned.length > 0) {
          this.alerts.push({
              id: Math.random(),
              message: `${unassigned.length} colis en attente d'assignation critique.`,
              type: 'medium'
          });
      }

      if (this.stats.delivered > 0) {
          const rate = (this.stats.delivered / (this.stats.total || 1) * 100).toFixed(1);
          this.alerts.push({
              id: Math.random(),
              message: `Performance Globale : ${rate}% des livraisons complétées.`,
              type: 'low'
          });
      }
      this.alerts = this.alerts.slice(0, 4);
  }

  private renderCharts(apiStats: any) {
    this.charts.forEach(c => c.destroy());
    this.charts = [];

    const zoneCtx = document.getElementById('zoneChart') as HTMLCanvasElement;
    if (zoneCtx) {
        const zoneData = apiStats?.zoneBreakdown || {};
        const labels = Object.keys(zoneData);
        const values = Object.values(zoneData);
        
        const chart = new Chart(zoneCtx, {
            type: 'bar',
            data: {
                labels: labels.length ? labels : ['Nord', 'Sud', 'Est', 'Ouest'],
                datasets: [{
                    label: 'Volume Colis',
                    data: (values.length ? values : [40, 25, 35, 20]) as any[],
                    backgroundColor: 'rgba(34, 211, 238, 0.8)',
                    hoverBackgroundColor: '#22d3ee',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10, weight: 'bold' } } },
                    y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 10 } } }
                }
            }
        });
        this.charts.push(chart);
    }

    const statusCtx = document.getElementById('statusChart') as HTMLCanvasElement;
    if (statusCtx) {
        const chart = new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['En Attente', 'En Transit', 'Livré', 'Retard'],
                datasets: [{
                    data: [this.stats.pending, this.stats.inTransit, this.stats.delivered, this.stats.delayed],
                    backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { 
                        position: 'bottom', 
                        labels: { 
                            color: '#94a3b8', 
                            usePointStyle: true,
                            font: { size: 11, weight: 'bold' } 
                        } 
                    }
                }
            }
        });
        this.charts.push(chart);
    }
  }

  private loadFallbackMock() {
      this.stats = { total: 154, pending: 42, inTransit: 38, delivered: 68, delayed: 6 };
      setTimeout(() => this.renderCharts(null), 100);
  }
}
