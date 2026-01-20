import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../Core/services/auth.service';
import { ColisService } from '../../../Core/services/colis.service';
import { LivreurService } from '../../../Core/services/livreur.service';
import { ZoneService } from '../../../Core/services/zone.service';

@Component({
    selector: 'app-manager-dashboard',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './manager-dashboard.component.html',
    styleUrl: './manager-dashboard.component.css'
})
export class ManagerDashboardComponent implements OnInit {
    // Tabs
    activeTab: 'shipments' | 'personnel' = 'shipments';

    // Colis Data
    colisList: any[] = [];
    selectedColis: any | null = null;
    eligibleLivreurs: any[] = [];

    // Livreur Data
    livreurList: any[] = [];
    zoneList: any[] = [];
    isLivreurModalOpen = false;
    livreurForm: FormGroup;

    // Loading States
    isLoading = false;
    isAssignmentLoading = false;
    isLivreurActionLoading = false;

    // Pagination
    currentPage = 0;
    pageSize = 10;
    totalPages = 0;

    constructor(
        private colisService: ColisService,
        private livreurService: LivreurService,
        private zoneService: ZoneService,
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.livreurForm = this.fb.group({
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            telephone: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            vehicule: ['', Validators.required],
            zoneAssigneeId: ['', Validators.required]
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    ngOnInit(): void {
        this.loadColis();
        this.loadZones();
    }

    switchTab(tab: 'shipments' | 'personnel') {
        this.activeTab = tab;
        if (tab === 'shipments') {
            this.loadColis();
        } else {
            this.loadLivreurs();
        }
    }

    // --- Colis Logic ---
    // --- Colis Logic ---
    // --- Colis Logic ---
    filterMode: 'ALL' | 'AVAILABLE' | 'ASSIGNED' = 'ALL';

    setFilterMode(mode: 'ALL' | 'AVAILABLE' | 'ASSIGNED') {
        this.filterMode = mode;
        this.currentPage = 0; // Reset page
        this.loadColis();
    }

    loadColis() {
        this.isLoading = true;

        let request$;
        if (this.filterMode === 'AVAILABLE') {
            request$ = this.colisService.getAvailableColis(this.currentPage, this.pageSize);
        } else if (this.filterMode === 'ASSIGNED') {
            request$ = this.colisService.getAllAssignedColis(this.currentPage, this.pageSize);
        } else {
            request$ = this.colisService.getAllColis(this.currentPage, this.pageSize);
        }

        request$.subscribe({
            next: (response) => {
                this.colisList = response.content;
                this.totalPages = response.totalPages;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading colis', err);
                this.isLoading = false;
            }
        });
    }

    onSelectColis(colis: any) {
        this.selectedColis = colis;
        this.eligibleLivreurs = [];
        this.isAssignmentLoading = true;

        // Convert status if needed, assuming backend returns 'CREE', 'COLLECTE', etc.
        // We allow assignment mainly if status is CREE or maybe COLLECTE unassigned?
        // Logic: fetch eligible livreurs
        this.colisService.getEligibleLivreurs(colis.id).subscribe({
            next: (livreurs) => {
                this.eligibleLivreurs = livreurs;
                this.isAssignmentLoading = false;
            },
            error: (err) => {
                console.error('Error loading livreurs', err);
                this.isAssignmentLoading = false;
            }
        });
    }

    assignLivreur(livreurId: string) {
        if (!this.selectedColis) return;
        if (!confirm('Assign this livreur to the colis?')) return;

        this.isAssignmentLoading = true;
        this.colisService.assignLivreur(this.selectedColis.id, livreurId).subscribe({
            next: () => {
                alert('Livreur assigned successfully');
                this.selectedColis = null; // Close modal/panel
                this.loadColis(); // Refresh list
                this.isAssignmentLoading = false;
            },
            error: (err) => {
                console.error('Error assigning livreur', err);
                alert('Failed to assign livreur: ' + (err.error?.message || 'Unknown error'));
                this.isAssignmentLoading = false;
            }
        });
    }

    closePanel() {
        this.selectedColis = null;
        this.eligibleLivreurs = [];
    }

    // --- Livreur Logic ---
    loadLivreurs() {
        this.isLoading = true;
        this.livreurService.getAllLivreurs(this.currentPage, this.pageSize).subscribe({
            next: (response) => {
                this.livreurList = response.content;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading livreurs', err);
                this.isLoading = false;
            }
        });
    }

    loadZones() {
        this.zoneService.getAllZones().subscribe({
            next: (zones) => {
                this.zoneList = zones;
            },
            error: (err) => console.error('Error loading zones', err)
        });
    }

    openLivreurModal() {
        this.isLivreurModalOpen = true;
        this.livreurForm.reset();
    }

    closeLivreurModal() {
        this.isLivreurModalOpen = false;
    }

    submitLivreur() {
        if (this.livreurForm.invalid) return;

        this.isLivreurActionLoading = true;
        this.livreurService.createLivreur(this.livreurForm.value).subscribe({
            next: () => {
                alert('Livreur created successfully');
                this.closeLivreurModal();
                this.loadLivreurs();
                this.isLivreurActionLoading = false;
            },
            error: (err) => {
                console.error('Error creating livreur', err);
                alert('Failed to create livreur');
                this.isLivreurActionLoading = false;
            }
        });
    }

    deleteLivreur(id: string) {
        if (!confirm('Are you sure you want to delete this agent?')) return;

        this.isLivreurActionLoading = true;
        this.livreurService.deleteLivreur(id).subscribe({
            next: () => {
                this.loadLivreurs();
                this.isLivreurActionLoading = false;
            },
            error: (err) => {
                console.error('Error deleting livreur', err);
                alert('Failed to delete livreur (might be assigned to active shipments)');
                this.isLivreurActionLoading = false;
            }
        });
    }

    // --- Tracking Logic ---
    isTrackingModalOpen = false;
    trackingHistory: any[] = [];
    trackingColisId: string = '';

    trackColis(colis: any) {
        this.trackingColisId = colis.id;
        this.isTrackingModalOpen = true;
        this.trackingHistory = [];

        this.colisService.getColisHistory(colis.id).subscribe({
            next: (data: any) => {
                // Assuming data is Page or List. Endpoint returns Page<HistoriqueLivraisonResponse>
                this.trackingHistory = data.content ? data.content : data;
            },
            error: (err) => console.error('Error loading history', err)
        });
    }

    closeTrackingModal() {
        this.isTrackingModalOpen = false;
        this.trackingHistory = [];
    }

    // --- Helpers ---
    getPrioriteClass(priorite: string): string {
        switch (priorite) {
            case 'URGENT': return 'text-red-500 font-bold';
            case 'NORMAL': return 'text-blue-500';
            case 'FAIBLE': return 'text-slate-500';
            default: return 'text-white';
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'CREE': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
            case 'COLLECTE': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
            case 'EN_STOCK': return 'bg-white/20 text-white border-white/50';
            case 'EN_TRANSIT': return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
            case 'LIVRE': return 'bg-green-500/20 text-green-500 border-green-500/50';
            case 'ANNULE': return 'bg-red-500/20 text-red-500 border-red-500/50';
            default: return 'bg-slate-500/20 text-slate-500 border-slate-500/50';
        }
    }
}
