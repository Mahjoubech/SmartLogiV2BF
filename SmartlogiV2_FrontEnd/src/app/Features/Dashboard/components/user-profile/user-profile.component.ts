import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthResponse } from '../../../../Core/api/models/auth-response';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-wrapper" *ngIf="user">
       <!-- Clickable Profile Area -->
      <div class="user-pill" (click)="onProfileClick()">
        <div class="avatar">
          {{ getInitials(user) }}
        </div>
        <div class="user-details">
          <span class="name">{{ user.prenom }} {{ user.nom }}</span>
          <span class="sub-text">View Profile</span>
        </div>
      </div>

      <!-- Separate Logout Button -->
      <button class="logout-mini-btn" (click)="onLogout()" title="Logout">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .profile-wrapper {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.35rem 1rem 0.35rem 0.35rem; /* Padding adjusted for left avatar */
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 50px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .user-pill:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(34, 211, 238, 0.3);
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(34, 211, 238, 0.1);
      color: #22d3ee;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      border: 1px solid rgba(34, 211, 238, 0.2);
    }

    .user-details {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .name {
      font-size: 0.85rem;
      font-weight: 600;
      color: #f8fafc;
    }

    .sub-text {
      font-size: 0.65rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .logout-mini-btn {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.2);
        cursor: pointer;
        transition: all 0.2s;
    }

    .logout-mini-btn:hover {
        background: #ef4444;
        color: white;
        transform: rotate(90deg);
    }
  `]
})
export class UserProfileComponent {
  @Input({ required: true }) user!: AuthResponse | null;
  @Output() logout = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>(); 

  getInitials(user: AuthResponse): string {
    const first = user.prenom ? user.prenom.charAt(0).toUpperCase() : '';
    const last = user.nom ? user.nom.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
  }

  onLogout() {
    this.logout.emit();
  }

  onProfileClick() {
    this.profileClick.emit();
  }
  
}
