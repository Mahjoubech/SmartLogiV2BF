import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../Core/services/notification.service';
import { ColisService } from '../../../Core/services/colis.service';
import { AuthService } from '../../../Core/services/auth.service';
import { LivreurService } from '../../../Core/services/livreur.service';

import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms'; // Add Import

@Component({
    selector: 'app-livreur-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule], // Add FormsModule
    templateUrl: './livreur-dashboard.component.html',
    styleUrl: './livreur-dashboard.component.css'
})
export class LivreurDashboardComponent implements OnInit {
    notifications: any[] = [];
    assignedColis: any[] = [];
    livreurId: string = '';
    isLoading = false;
    isNotificationsModalOpen = false;

    // UI State
    currentFilter: 'ALL' | 'TO_COLLECT' | 'TO_DELIVER' | 'HISTORY' = 'ALL';
    currentSort: 'DATE' | 'PRIORITY' | 'ZONE' = 'DATE';

    constructor(
        private notificationService: NotificationService,
        private livreurService: LivreurService,
        private authService: AuthService,
        private colisService: ColisService,
        private router: Router
    ) { }

    // --- Computed Properties ---

    get currentDate(): Date {
        return new Date();
    }

    get stats() {
        return {
            total: this.assignedColis.length,
            toCollect: this.assignedColis.filter(c => c.status === 'COLLECTE' || c.status === 'CREE').length,
            toDeliver: this.assignedColis.filter(c => c.status === 'EN_TRANSIT' || c.status === 'EN_STOCK').length,
            completed: this.assignedColis.filter(c => c.status === 'LIVRE').length
        };
    }

    get unreadCount(): number {
        return this.notifications.filter(n => !n.read).length;
    }

    get filteredColis() {
        let list = [];
        switch (this.currentFilter) {
            case 'TO_COLLECT':
                list = this.assignedColis.filter(c => c.status === 'COLLECTE' || c.status === 'CREE');
                break;
            case 'TO_DELIVER':
                list = this.assignedColis.filter(c => c.status === 'EN_TRANSIT' || c.status === 'EN_STOCK');
                break;
            case 'HISTORY':
                list = this.assignedColis.filter(c => c.status === 'LIVRE' || c.status === 'ANNULE');
                break;
            default:
                list = [...this.assignedColis]; // Copy
                break;
        }
        return this.applySort(list);
    }

    // --- Actions ---

    selectedColis: any = null;
    updateComment: string = '';
    newStatus: string = '';

    selectColis(colis: any) {
        this.selectedColis = colis;
        this.newStatus = colis.status; // Default to current
        this.updateComment = '';
    }

    closeColisDetails() {
        this.selectedColis = null;
        this.updateComment = '';
        this.newStatus = '';
    }

    submitStatusUpdate() {
        if (!this.selectedColis || !this.newStatus) return;
        if (this.newStatus === this.selectedColis.status) return; // No change

        if (!confirm(`Confirmer le changement de statut vers ${this.newStatus} ?`)) return;

        this.colisService.updateStatus(this.selectedColis.id, this.newStatus, this.updateComment).subscribe({
            next: (updated) => {
                this.loadAssignedColis(); // Reload list
                this.closeColisDetails();
            },
            error: (err) => console.error('Error updating status', err)
        });
    }

    setFilter(filter: 'ALL' | 'TO_COLLECT' | 'TO_DELIVER' | 'HISTORY') {
        this.currentFilter = filter;
    }

    setSort(sort: 'DATE' | 'PRIORITY' | 'ZONE') {
        this.currentSort = sort;
    }

    applySort(list: any[]): any[] {
        return list.sort((a, b) => {
            if (this.currentSort === 'PRIORITY') {
                const pMap: any = { 'URGENT': 1, 'NORMAL': 2, 'FAIBLE': 3 };
                return (pMap[a.prioriteStatus] || 2) - (pMap[b.prioriteStatus] || 2);
            } else if (this.currentSort === 'ZONE') {
                return (a.zone?.nom || '').localeCompare(b.zone?.nom || '');
            } else {
                // DATE default
                return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
            }
        });
    }

    openNotificationsModal() {
        this.isNotificationsModalOpen = true;
    }

    closeNotificationsModal() {
        this.isNotificationsModalOpen = false;
    }

    toggleNotificationsModal() {
        this.isNotificationsModalOpen = !this.isNotificationsModalOpen;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    ngOnInit(): void {
        const token = this.authService.getToken();
        if (token) {
            this.livreurId = this.extractUserId(token);
            this.loadNotifications();
            this.loadAssignedColis();
        }
    }

    private extractUserId(token: string): string {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId || payload.sub;
        } catch (e) {
            console.error('Error decoding token', e);
            return '';
        }
    }

    loadNotifications() {
        this.notificationService.getMyNotifications().subscribe({
            next: (data) => this.notifications = data,
            error: (err) => console.error('Error loading notifications', err)
        });
    }

    loadAssignedColis() {
        if (!this.livreurId) return;
        this.isLoading = true;
        this.colisService.getMyAssignedColis(0, 100).subscribe({
            next: (data) => {
                const content = data.content || [];
                // Map backend 'statut' (French) to frontend 'status' (English convention in this component)
                this.assignedColis = content.map((c: any) => ({
                    ...c,
                    status: c.status || c.statut // Handle both cases
                }));
                // Sort by current sort preference implied in applySort later
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading assigned colis', err);
                this.isLoading = false;
            }
        });
    }

    markAsRead(id: string) {
        this.notificationService.markAsRead(id).subscribe({
            next: () => {
                this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
            }
        });
    }

    updateStatusColis(colis: any, newStatus: string) {
        if (!confirm(`Confirmer le changement de statut vers ${newStatus} ?`)) return;

        this.colisService.updateStatus(colis.id, newStatus).subscribe({
            next: (updated) => {
                this.loadAssignedColis(); // Reload list
            },
            error: (err) => console.error('Error updating status', err)
        });
    }

    getAvailableStatuses(currentStatus: string): string[] {
        if (!currentStatus) return [];
        const status = currentStatus.toUpperCase();

        if (status === 'CREE') return ['COLLECTE']; // Allow picking up new assignments
        if (status === 'COLLECTE') return ['EN_STOCK'];
        if (status === 'EN_STOCK') return ['EN_TRANSIT']; // Allow manual pick up from stock
        if (status === 'EN_TRANSIT') return ['LIVRE', 'ANNULE', 'EN_STOCK'];

        return [];
    }

    getStatusColor(status: string): string {
        const s = status ? status.toUpperCase() : '';
        switch (s) {
            case 'CREE': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'COLLECTE': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'EN_STOCK': return 'text-slate-300 bg-slate-500/10 border-slate-500/20';
            case 'EN_TRANSIT': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'LIVRE': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'ANNULE': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    }
}
