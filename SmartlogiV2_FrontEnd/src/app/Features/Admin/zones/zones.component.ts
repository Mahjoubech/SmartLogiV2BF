import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZoneService } from '../../../Core/services/zone.service';
import { AdminService } from '../../../Core/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zones.component.html',
  styleUrl: './zones.component.css'
})
export class ZonesComponent implements OnInit {
  zones: any[] = [];
  managers: any[] = [];
  isLoading = false;

  constructor(
    private zoneService: ZoneService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    // Fetch zones and managers in parallel
    const zonesObs = this.zoneService.getAllZones();
    const managersObs = this.adminService.getAllManagers(0, 100);

    import('rxjs').then(({ forkJoin }) => {
        forkJoin({
            zones: zonesObs,
            managers: managersObs
        }).subscribe({
            next: (data: any) => {
                this.zones = data.zones;
                this.managers = data.managers.content || data.managers;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading zones/managers', err);
                this.isLoading = false;
                Swal.fire('Erreur', 'Impossible de charger les données.', 'error');
            }
        });
    });
  }

  onManagerChange(zone: any) {
    if (!zone.newManagerId) return;

    Swal.fire({
      title: 'Confirmer l\'assignation ?',
      text: `Voulez-vous assigner l'utilisateur sélectionné comme gestionnaire de la zone ${zone.nom} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, assigner',
      cancelButtonText: 'Annuler',
      background: '#0f172a',
      color: '#f8fafc'
    }).then((result) => {
      if (result.isConfirmed) {
        this.zoneService.assignManagerToZone(zone.id, zone.newManagerId).subscribe({
          next: () => {
             Swal.fire({
                title: 'Succès',
                text: 'Le gestionnaire a été assigné avec succès.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: '#0f172a',
                color: '#f8fafc'
             });
             this.loadData();
          },
          error: (err) => {
             console.error('Assignment failed', err);
             const msg = err.error || 'Erreur lors de l\'assignation. Vérifiez que l\'utilisateur a le rôle MANAGER.';
             Swal.fire('Erreur', msg, 'error');
             // Reset selection
             zone.newManagerId = null;
          }
        });
      } else {
          zone.newManagerId = null;
      }
    });
  }
}
