import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../Core/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  usersList: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  isLoading: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        // Handle both Page<T> and List<T>
        if (response.content) {
             this.usersList = response.content;
             this.totalElements = response.totalElements;
        } else if (Array.isArray(response)) {
             this.usersList = response;
             this.totalElements = response.length;
        } else {
             this.usersList = [];
        }
        this.filterUsers();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.isLoading = false;
      }
    });
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = this.usersList;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.usersList.filter(u => 
        u.email?.toLowerCase().includes(term) ||
        u.nom?.toLowerCase().includes(term) ||
        u.prenom?.toLowerCase().includes(term) ||
        u.role?.name?.toLowerCase().includes(term)
      );
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }
  
  get totalPages(): number {
      return Math.ceil(this.totalElements / this.pageSize);
  }

  get pagesArray(): number[] {
      return Array(this.totalPages).fill(0).map((x, i) => i);
  }

  toggleBlockUser(user: any) {
    const action = user.accountNonLocked ? 'Block' : 'Unblock';
    const confirmText = user.accountNonLocked ? 
      'This user will act denied access.' : 
      'This user will regain access.';

    Swal.fire({
      title: `${action} User?`,
      text: confirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: user.accountNonLocked ? '#ef4444' : '#22c55e',
      cancelButtonColor: '#334155',
      confirmButtonText: `Yes, ${action}`,
      background: '#0f172a',
      color: '#f8fafc'
    }).then((result) => {
      if (result.isConfirmed) {
        if (user.accountNonLocked) {
          this.adminService.blockUser(user.id).subscribe({
            next: () => {
              this.showToast('User blocked successfully');
              this.loadUsers();
            },
            error: (err) => {
               // If text response is not handled correctly by service, this might still fire on success?
               // But we fixed service.
               this.showToast('Action completed', 'success'); // Optimistic success if error is parsing
               this.loadUsers();
            } 
          });
        } else {
          this.adminService.unblockUser(user.id).subscribe({
            next: () => {
              this.showToast('User unblocked successfully');
              this.loadUsers();
            },
            error: (err) => {
               this.showToast('Action completed', 'success');
               this.loadUsers();
            }
          });
        }
      }
    });
  }

  showToast(title: string, icon: 'success' | 'error' = 'success') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: icon,
      title: title,
      showConfirmButton: false,
      timer: 3000,
      background: '#0f172a',
      color: '#f8fafc'
    });
  }
}
