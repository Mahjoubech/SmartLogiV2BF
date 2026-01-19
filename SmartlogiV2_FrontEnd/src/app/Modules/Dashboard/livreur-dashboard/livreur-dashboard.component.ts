import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../Core/services/notification.service';
import { ColisService } from '../../../Core/services/colis.service';
import { AuthService } from '../../../Core/services/auth.service';
import { LivreurService } from '../../../Core/services/livreur.service';

import { Router } from '@angular/router';

@Component({
    selector: 'app-livreur-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './livreur-dashboard.component.html',
    styleUrl: './livreur-dashboard.component.css'
})
export class LivreurDashboardComponent implements OnInit {
    notifications: any[] = [];
    assignedColis: any[] = [];
    livreurId: string = '';
    isLoading = false;

    constructor(
        private notificationService: NotificationService,
        private livreurService: LivreurService,
        private authService: AuthService,
        private colisService: ColisService,
        private router: Router
    ) { }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    ngOnInit(): void {
        const token = this.authService.token;
        if (token) {
            // Decoding token basic way or assuming we store user info.
            // Ideally TokenService has a method to get user ID or we fetch /me.
            // For now, assuming the token payload has the ID or we fetch it from a 'UserContextService'.
            // If TokenService doesn't expose ID easily, we might need to hit a /me endpoint or similar.
            // Let's assume we can get it from the token payload helper or similar.
            this.livreurId = this.extractUserId(token);
            this.loadNotifications();
            this.loadAssignedColis();
        }
    }

    private extractUserId(token: string): string {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.userId || payload.sub; // Adjust based on your JWT structure
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
                this.assignedColis = data.content;
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
                // Optionally show toast
            },
            error: (err) => console.error('Error updating status', err)
        });
    }

    getAvailableStatuses(currentStatus: string): string[] {
        // Logic for allowed transitions
        if (currentStatus === 'COLLECTE') return ['EN_STOCK'];
        if (currentStatus === 'EN_STOCK') return ['EN_TRANSIT'];
        if (currentStatus === 'EN_TRANSIT') return ['LIVRE', 'ANNULE', 'EN_STOCK'];
        return [];
    }
}
