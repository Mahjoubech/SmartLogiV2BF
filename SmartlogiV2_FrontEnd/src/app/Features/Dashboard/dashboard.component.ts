import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Core/services/auth.service';
import { ColisService } from '../../Core/services/colis.service';
import { Router } from '@angular/router';
import { Observable, map, switchMap, of, BehaviorSubject } from 'rxjs';
import { ColisResponse } from '../../Core/api/models/colis-response';
import { ColisSearchPipe } from '../../Shared/pipes/colis-search.pipe';
import { ColisCardComponent } from './components/colis-card/colis-card.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CreateColisWizardComponent } from './components/create-colis-wizard/create-colis-wizard.component';
import { SmartLogiLogoComponent } from '../../Shared/components/smartlogi-logo/smartlogi-logo.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { PaginatePipe } from '../../Shared/pipes/paginate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ColisSearchPipe,
    ColisCardComponent,
    UserProfileComponent,
    CreateColisWizardComponent,
    SmartLogiLogoComponent,
    PaginatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  currentUser$;
  private refresh$ = new BehaviorSubject<void>(undefined);
  colis$: Observable<ColisResponse[]> = of([]);
  searchText: string = '';
  selectedColis: ColisResponse | null = null;
  isDetailOpen: boolean = false;
  activeTab: 'MANIFEST' | 'NEW_MISSION' | 'STATISTICS' | 'DELIVERED' | 'PROFILE' = 'MANIFEST';

  // Pagination State
  currentPage: number = 1;
  itemsPerPage: number = 3;

  stats = {
    total: 0,
    delivered: 0,
    transit: 0,
    pending: 0,
    weight: 0
  };

  passwordData = { current: '', new: '', confirm: '' };
  isUpdatingPassword = false;
  pwMessage = '';
  pwMsgType: 'success' | 'error' = 'success';

  constructor(
    public authService: AuthService,
    private colisService: ColisService,
    public router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.authService.syncUser().subscribe();
    this.colis$ = this.refresh$.pipe(
      switchMap(() => this.currentUser$),
      switchMap(user => {
        if (user?.email) {
          return this.colisService.getColisByExpediteur(user.email);
        }
        return of([]);
      }),
      // Tap to calculate stats
      map((colis: ColisResponse[]) => {
        this.calculateStats(colis);
        return colis;
      })
    );
  }

  calculateStats(colis: ColisResponse[]) {
    this.stats = {
      total: colis.length,
      delivered: colis.filter(c => c.statut?.includes('LIVRE')).length,
      transit: colis.filter(c => c.statut?.includes('COURS') || c.statut?.includes('TRANSIT')).length,
      pending: colis.filter(c => c.statut === 'CREE' || c.statut === 'ATTENTE').length,
      weight: colis.reduce((acc, c) => acc + (c.poids || 0), 0)
    };
  }

  setTab(tab: 'MANIFEST' | 'NEW_MISSION' | 'STATISTICS' | 'DELIVERED' | 'PROFILE') {
    this.activeTab = tab;
    this.currentPage = 1; // Reset to page 1 when tab changes
  }

  // Helper for pagination
  changePage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getMathCeil(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  refreshColisList() {
    this.refresh$.next();
  }

  onColisCompleted() {
    this.activeTab = 'MANIFEST';
    this.refreshColisList();
  }

  viewDetails(colis: ColisResponse) {
    this.selectedColis = colis;
    this.isDetailOpen = true;
  }

  closeDetails() {
    this.isDetailOpen = false;
    this.selectedColis = null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getStatusClass(statut: string | undefined): string {
    if (!statut) return 'status-default';
    const s = statut.toLowerCase();
    if (s.includes('livré')) return 'status-delivered';
    if (s.includes('cours')) return 'status-transit';
    if (s.includes('attente')) return 'status-pending';
    return 'status-default';
  }

  shouldShowItem(item: ColisResponse, tab: string): boolean {
    const isDelivered = item.statut?.toLowerCase().includes('livré');

    if (tab === 'DELIVERED') {
      return !!isDelivered;
    }
    if (tab === 'MANIFEST') {
      return !isDelivered;
    }
    return true; // Fallback
  }

  onChangePassword() {
    if (this.passwordData.new !== this.passwordData.confirm) {
      this.pwMessage = 'Passwords do not match';
      this.pwMsgType = 'error';
      return;
    }

    this.isUpdatingPassword = true;
    this.pwMessage = '';

    this.authService.updatePassword(this.passwordData.current, this.passwordData.new).subscribe({
      next: (msg) => {
        this.isUpdatingPassword = false;
        this.pwMessage = 'Password updated successfully';
        this.pwMsgType = 'success';
        this.passwordData = { current: '', new: '', confirm: '' };
      },
      error: (err) => {
        this.isUpdatingPassword = false;
        this.pwMessage = err.error || 'Failed to update password';
        this.pwMsgType = 'error';
      }
    });
  }
}
