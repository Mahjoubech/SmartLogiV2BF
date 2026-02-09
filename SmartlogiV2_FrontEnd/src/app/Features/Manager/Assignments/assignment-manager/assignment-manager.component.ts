import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColisService } from '../../../../Core/services/colis.service';
import { LivreurService } from '../../../../Core/services/livreur.service';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-assignment-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignment-manager.component.html',
  styleUrl: './assignment-manager.component.css'
})
export class AssignmentManagerComponent implements OnInit {
  
  
  unassignedParcels: any[] = [];
  couriers: any[] = [];
  isLoading = false;
  isAssigning = false;
  
  
  searchTermParcels = '';
  searchTermCouriers = '';
  
  
  selectedParcels: Set<string> = new Set();
  selectedCourierId: string | null = null;

  
  statusPopup = {
    show: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: ''
  };

  constructor(
      private readonly colisService: ColisService,
      private readonly livreurService: LivreurService
  ) {}

  get filteredParcels() {
    if (!this.searchTermParcels) return this.unassignedParcels;
    const term = this.searchTermParcels.toLowerCase();
    return this.unassignedParcels.filter(p => 
      p.id?.toLowerCase().includes(term) || 
      p.villeDestination?.toLowerCase().includes(term)
    );
  }

  get filteredCouriers() {
    let list = this.couriers;
    if (this.searchTermCouriers) {
      const term = this.searchTermCouriers.toLowerCase();
      list = list.filter(c => 
        c.nom?.toLowerCase().includes(term) || 
        c.prenom?.toLowerCase().includes(term) ||
        c.zoneAssignee?.nom?.toLowerCase().includes(term)
      );
    }
    
    
    if (this.selectedParcels.size > 0) {
      return [...list].sort((a, b) => {
        const aComp = this.isZoneCompatible(a);
        const bComp = this.isZoneCompatible(b);
        if (aComp === bComp) return 0;
        return aComp ? -1 : 1;
      });
    }
    
    return list;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    
    forkJoin({
        parcels: this.colisService.getAvailableColis(0, 50),
        livreurs: this.livreurService.getAllLivreurs(0, 50)
    }).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
            
            this.unassignedParcels = data.parcels?.content || (Array.isArray(data.parcels) ? data.parcels : []);
            this.couriers = data.livreurs?.content || (Array.isArray(data.livreurs) ? data.livreurs : []);
            console.log('[AssignmentManager] Loaded Data:', { parcels: this.unassignedParcels.length, couriers: this.couriers.length });
        },
        error: (err) => console.error('[AssignmentManager] Sync Error:', err)
      });
  }

  toggleParcelSelection(parcelId: any) {
    if (!parcelId) return;
    const id = String(parcelId);
    if (this.selectedParcels.has(id)) {
      this.selectedParcels.delete(id);
    } else {
      this.selectedParcels.add(id);
    }
  }

  selectCourier(courierId: any) {
    if (!courierId) return;
    this.selectedCourierId = String(courierId);
  }

  assignParcels() {
    if (!this.selectedCourierId || this.selectedParcels.size === 0) return;
    
    
    const courier = this.couriers.find(c => String(c.id) === this.selectedCourierId);
    const selectedParcelObjs = this.unassignedParcels.filter(p => this.selectedParcels.has(String(p.id)));
    
    const incompatible = selectedParcelObjs.filter(p => {
        const requiredZoneId = p.status === 'CREE' ? p.zoneOrigine?.id : p.zone?.id;
        return requiredZoneId !== courier?.zoneAssignee?.id;
    });
    
    if (incompatible.length > 0) {
        const pNames = incompatible.map(p => {
            const zName = p.status === 'CREE' ? p.zoneOrigine?.nom : p.zone?.nom;
            const type = p.status === 'CREE' ? 'Origine' : 'Destination';
            return `#${String(p.id).substring(0,8)} (${type}: ${zName || '?'})`;
        }).join(', ');
        
        this.showPopup(
            'error', 
            'Conflit de Zone Détecté', 
            `Certains colis ne correspondent pas à la zone du livreur : ${pNames}.`
        );
        return;
    }

    this.isAssigning = true;
    const parcelIds = Array.from(this.selectedParcels);
    
    console.log(`[AssignmentManager] Executing assignment for:`, {
        courier: courier?.nom,
        zone: courier?.zoneAssignee?.nom,
        parcels: parcelIds
    });

    const assignments = parcelIds.map(pid => 
        this.colisService.assignLivreur(pid, this.selectedCourierId!)
    );

    forkJoin(assignments)
        .pipe(finalize(() => {
            this.isAssigning = false;
        }))
        .subscribe({
            next: (results) => {
                this.showPopup(
                    'success', 
                    'Assignation Réussie', 
                    `${parcelIds.length} colis ont été assignés avec succès.`
                );
                this.selectedParcels.clear();
                this.selectedCourierId = null;
                this.loadData();
            },
            error: (err) => {
                console.error('[AssignmentManager] Assignment failed', err);
                const msg = err.error?.message || 'Erreur lors de l\'assignation.';
                this.showPopup('error', 'Échec de l\'opération', msg);
                this.loadData();
            }
        });
  }

  showPopup(type: 'success' | 'error', title: string, message: string) {
      this.statusPopup = { show: true, type, title, message };
  }

  closePopup() {
      this.statusPopup.show = false;
  }

  getWeightProgress(courier: any): number {
    const current = courier.assignedColisCount || 0;
    const max = 3; 
    return Math.min((current / max) * 100, 100);
  }

  isZoneCompatible(courier: any): boolean {
    if (this.selectedParcels.size === 0) return true;
    
    
    const selectedParcelObjs = this.unassignedParcels.filter(p => this.selectedParcels.has(p.id));
    
    return selectedParcelObjs.every(p => {
        const requiredZoneId = p.status === 'CREE' ? p.zoneOrigine?.id : p.zone?.id;
        return requiredZoneId === courier.zoneAssignee?.id;
    });
  }

  getLoadColor(courier: any): string {
    const percentage = this.getWeightProgress(courier);
    if (percentage > 90) return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]';
    if (percentage > 70) return 'bg-amber-500';
    return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
  }
}
