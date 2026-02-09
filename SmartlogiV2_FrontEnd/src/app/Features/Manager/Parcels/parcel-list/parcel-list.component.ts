import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ColisService } from '../../../../Core/services/colis.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-parcel-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parcel-list.component.html',
  styleUrl: './parcel-list.component.css'
})
export class ParcelListComponent implements OnInit {
  
  
  searchTerm: string = '';
  selectedStatus: string = '';
  selectedZone: string = '';
  selectedPriority: string = '';
  
  
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  
  
  parcels: any[] = [];
  isLoading = false;
  
  
  statuses = ['CREE', 'COLLECTE', 'EN_STOCK', 'EN_TRANSIT', 'LIVRE', 'ANNULE'];
  zones: any[] = [];
  priorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

  constructor(
    private router: Router,
    private colisService: ColisService
  ) {}

  ngOnInit() {
    this.loadParcels();
  }

  loadParcels() {
    this.isLoading = true;
    this.colisService.getAllColis(this.currentPage, this.pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.parcels = response.content || response;
          this.totalElements = response.totalElements || this.parcels.length;
          this.totalPages = response.totalPages || 1;
        },
        error: (err) => {
          console.error('API Error loading parcels', err);
        }
      });
  }

  get filteredParcels() {
    let result = this.parcels;
    if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        result = result.filter(p => 
            (p.id?.toLowerCase().includes(term)) ||
            (p.destinataire?.nom?.toLowerCase().includes(term)) ||
            (p.destinataire?.prenom?.toLowerCase().includes(term)) ||
            (p.villeDestination?.toLowerCase().includes(term))
        );
    }
    if (this.selectedStatus) {
        result = result.filter(p => p.statut === this.selectedStatus);
    }
    if (this.selectedPriority) {
        result = result.filter(p => p.priorite === this.selectedPriority);
    }
    return result;
  }

  applyFilters() {
      
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedZone = '';
    this.selectedPriority = '';
  }

  nextPage() {
      if (this.currentPage < this.totalPages - 1) {
          this.currentPage++;
          this.loadParcels();
      }
  }

  prevPage() {
      if (this.currentPage > 0) {
          this.currentPage--;
          this.loadParcels();
      }
  }

  
  isDetailModalOpen = false;
  selectedParcel: any = null;
  parcelHistory: any[] = [];
  isLoadingHistory = false;

  viewDetails(colis: any) {
    this.selectedParcel = colis;
    this.isDetailModalOpen = true;
    this.loadHistory(colis.id);
  }

  editParcel(colis: any) {
      console.log('Edit colis triggered', colis);
      
  }

  deleteParcel(colis: any) {
      if (confirm(`Voulez-vous vraiment supprimer le colis #${colis.id?.substring(0,8).toUpperCase()}?`)) {
          console.log('Delete colis triggered', colis);
          
      }
  }

  loadHistory(id: string) {
      this.isLoadingHistory = true;
      this.colisService.getColisHistory(id)
        .pipe(finalize(() => this.isLoadingHistory = false))
        .subscribe({
          next: (history) => {
              this.parcelHistory = history.content || (Array.isArray(history) ? history : []);
          },
          error: (err) => console.error('History API error', err)
        });
  }

  closeDetails() {
      this.isDetailModalOpen = false;
      this.selectedParcel = null;
  }

  getPriorityColor(priority: string): string {
      const p = (priority || '').toUpperCase();
      switch(p) {
          case 'URGENT': case 'HIGH': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
          case 'NORMAL': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
          default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
      }
  }

  getStatusColor(status: string): string {
      const s = (status || '').toUpperCase();
      switch(s) {
          case 'CREE': return 'text-amber-500 bg-amber-500/10';
          case 'EN_STOCK': return 'text-purple-500 bg-purple-500/10';
          case 'COLLECTE': return 'text-blue-400 bg-blue-400/10';
          case 'EN_TRANSIT': return 'text-blue-600 bg-blue-600/10';
          case 'LIVRE': return 'text-emerald-500 bg-emerald-500/10';
          case 'ANNULE': return 'text-rose-500 bg-rose-500/10';
          default: return 'text-slate-500 bg-slate-500/10';
      }
  }
}
