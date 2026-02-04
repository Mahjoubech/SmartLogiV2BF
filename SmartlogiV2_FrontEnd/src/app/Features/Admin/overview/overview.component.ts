import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../Core/services/admin.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit, AfterViewInit {
  stats: any = {
    totalUsers: 0,
    totalClients: 0,
    activeManagers: 0,
    blockedUsers: 0
  };

  topLivreurs: any[] = [];
  topManagers: any[] = [];

  constructor(private adminService: AdminService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.loadStats();
  }

  ngAfterViewInit() {
    setTimeout(() => {
        this.renderCharts();
    }, 500);
  }

  loadStats() {
    this.adminService.getAllUsers(0, 1000).subscribe({
        next: (response) => {
            const users = response.content || response; 
            if (Array.isArray(users)) {
                this.stats.totalUsers = users.length;
                this.stats.totalClients = users.filter((u: any) => u.role?.name === 'CLIENT').length;
                
                const managers = users.filter((u: any) => u.role?.name === 'MANAGER');
                this.stats.activeManagers = managers.length;
                
                const livreurs = users.filter((u: any) => u.role?.name === 'LIVREUR');
                
                this.stats.blockedUsers = users.filter((u: any) => !u.accountNonLocked).length;

                // Mock Performance Data for Top Lists
                this.topLivreurs = livreurs.map((l: any) => ({
                    ...l,
                    livreColis: Math.floor(Math.random() * 500) + 50 // Mock Data
                }))
                .sort((a: any, b: any) => b.livreColis - a.livreColis)
                .slice(0, 5);

                this.topManagers = managers.map((m: any) => ({
                    ...m,
                    managedZones: Math.floor(Math.random() * 10) + 1, // Mock Data
                    totalParcels: Math.floor(Math.random() * 2000) + 100
                }))
                .sort((a: any, b: any) => b.totalParcels - a.totalParcels)
                .slice(0, 5);
                
                this.renderCharts();
            }
        },
        error: (err) => console.error('Failed to load stats', err)
    });
  }

  renderCharts() {
    const ctx = document.getElementById('userChart') as HTMLCanvasElement;
    if (!ctx) return;

    // simplistic destroy check
    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Clients', 'Managers', 'Livreurs'],
        datasets: [{
          data: [
            this.stats.totalClients, 
            this.stats.activeManagers, 
            this.stats.totalUsers - (this.stats.totalClients + this.stats.activeManagers)
          ],
          backgroundColor: ['#06b6d4', '#8b5cf6', '#10b981'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow custom size
        cutout: '75%', // Thinner ring
        plugins: {
          legend: { 
              position: 'bottom', 
              labels: { 
                  color: '#94a3b8',
                  usePointStyle: true,
                  padding: 20,
                  font: {
                      size: 11
                  }
              } 
          },
          tooltip: {
              backgroundColor: '#0f172a',
              titleColor: '#f8fafc',
              bodyColor: '#cbd5e1',
              padding: 12,
              cornerRadius: 8,
              borderColor: '#1e293b',
              borderWidth: 1
          }
        }
      }
    });
  }
}
