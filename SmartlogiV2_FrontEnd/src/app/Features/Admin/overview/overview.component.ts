import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../Core/services/admin.service';
import { Chart, registerables } from 'chart.js';
// @ts-ignore
import { jsPDF } from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';

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

  // Manager Details Modal
  isManagerDetailsModalOpen = false;
  selectedManager: any = null;

  openManagerDetails(manager: any) {
      this.selectedManager = manager;
      this.isManagerDetailsModalOpen = true;
  }

  closeManagerDetails() {
      this.isManagerDetailsModalOpen = false;
      this.selectedManager = null;
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

                const cityNames = ['Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Agadir', 'Fes'];
                this.topManagers = managers.map((m: any) => {
                    const zoneCount = Math.floor(Math.random() * 5) + 2;
                    const zones = [];
                    for(let i=0; i<zoneCount; i++) {
                        zones.push({
                           name: `Zone ${cityNames[Math.floor(Math.random() * cityNames.length)]} ${Math.floor(Math.random()*10)}`,
                           status: Math.random() > 0.3 ? 'Active' : 'Pending',
                           parcels: Math.floor(Math.random() * 300)
                        });
                    }
                    
                    return {
                        ...m,
                        managedZones: zoneCount,
                        mockZones: zones, // Attached mock details
                        totalParcels: zones.reduce((acc, z) => acc + z.parcels, 0)
                    };
                })
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

  generateReport() {
        if (!this.selectedManager) return;
        
        const doc = new jsPDF();
        const manager = this.selectedManager;

        // Title
        doc.setFontSize(20);
        doc.text('Manager Zone Report', 14, 20);
        
        // Manager Info
        doc.setFontSize(12);
        doc.text(`Manager: ${manager.nom} ${manager.prenom}`, 14, 30);
        doc.text(`Email: ${manager.email}`, 14, 36);
        doc.text(`Phone: ${manager.telephone || 'N/A'}`, 14, 42);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 48);

        // Zones Table
        const zones = manager.mockZones || [];
        const tableData = zones.map((z: any) => [
            z.name,
            z.status,
            z.parcels
        ]);
        
        // Use autoTable imported function
        autoTable(doc, {
            startY: 55,
            head: [['Zone Name', 'Status', 'Parcels Volume']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [6, 182, 212] }, // cyan-500
        });

        doc.save(`report_${manager.nom}_${manager.prenom}.pdf`);
  }
}
