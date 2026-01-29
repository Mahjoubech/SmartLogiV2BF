import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../Core/services/auth.service';
import { AdminService } from '../../../Core/services/admin.service';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'stats' | 'clients' | 'managers' | 'roles' = 'stats';
  
  // Data Lists
  clientsList: any[] = [];
  managersList: any[] = [];
  rolesList: any[] = [];
  
  // Stats
  stats = {
    totalUsers: 0,
    totalClients: 0,
    activeManagers: 0,
    blockedUsers: 0
  };

  // Forms
  managerForm: FormGroup;
  
  // Modal States
  isManagerModalOpen = false;
  isEditing = false;
  selectedManagerId: string | null = null;
  isLoading = false;

  // Chart
  public userChart: any;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.managerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      password: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadUsers(); // Separates clients and managers internally
    this.loadRoles();
  }

  loadUsers() {
    this.adminService.getAllUsers(0, 100).subscribe({
      next: (data) => {
        const allUsers = data.content;
        
        // Filter Clients (Role CLIENT)
        this.clientsList = allUsers.filter((u: any) => u.role?.name === 'CLIENT');
        
        // Managers usually come from specific endpoint but checking here too just in case
        // But we will use the specific getAllManagers for detailed info
        this.loadManagers(); 
        
        this.stats.totalUsers = allUsers.length;
        this.stats.totalClients = this.clientsList.length;
        this.stats.blockedUsers = allUsers.filter((u: any) => !u.accountNonLocked).length;

        this.initCharts();
      },
      error: (err) => console.error('Error loading users', err)
    });
  }

  loadManagers() {
    this.adminService.getAllManagers(0, 100).subscribe({
      next: (data) => {
        this.managersList = data.content;
        this.stats.activeManagers = this.managersList.length;
        this.updateChart();
      },
      error: (err) => console.error('Error loading managers', err)
    });
  }

  loadRoles() {
    // Placeholder if endpoint exists
    // this.adminService.getAllRoles()...
  }

  initCharts() {
    if (this.userChart) this.userChart.destroy();

    const ctx = document.getElementById('userChart') as HTMLCanvasElement;
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Clients', 'Managers', 'Livreurs'],
        datasets: [{
          data: [
            this.stats.totalClients,
            this.stats.activeManagers,
            this.stats.totalUsers - (this.stats.totalClients + this.stats.activeManagers) // Rough estimate of others
          ],
          backgroundColor: [
            '#06b6d4', // Cyan (Clients)
            '#8b5cf6', // Violet (Managers)
            '#22c55e'  // Green (Livreurs/Others)
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: { family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas' }
            }
          }
        }
      }
    };

    this.userChart = new Chart(ctx, config);
  }

  updateChart() {
    if (this.userChart) {
      this.userChart.data.datasets[0].data = [
        this.stats.totalClients,
        this.stats.activeManagers,
        this.stats.totalUsers - (this.stats.totalClients + this.stats.activeManagers)
      ];
      this.userChart.update();
    } else {
        this.initCharts();
    }
  }

  // --- Actions ---

  toggleBlockUser(user: any, block: boolean) {
    const action = block ? 'block' : 'unblock';
    if (confirm(`Are you sure you want to ${action} ${user.prenom} ${user.nom}?`)) {
      if (block) {
        this.adminService.blockUser(user.id).subscribe({
            next: () => this.loadUsers(),
            error: (err) => console.error('Block failed', err)
        });
      } else {
        this.adminService.unblockUser(user.id).subscribe({
             next: () => this.loadUsers(),
             error: (err) => console.error('Unblock failed', err)
        });
      }
    }
  }

  // Manager CRUD
  openManagerModal() {
    this.isEditing = false;
    this.selectedManagerId = null;
    this.managerForm.reset();
    this.managerForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.managerForm.get('confirmPassword')?.setValidators([Validators.required]);
    this.managerForm.updateValueAndValidity();
    this.isManagerModalOpen = true;
  }

  editManager(manager: any) {
    this.isEditing = true;
    this.selectedManagerId = manager.id;
    this.managerForm.patchValue({
      nom: manager.nom,
      prenom: manager.prenom,
      email: manager.email,
      telephone: manager.telephone
    });
    this.managerForm.get('password')?.clearValidators();
    this.managerForm.get('password')?.updateValueAndValidity();
    this.managerForm.get('confirmPassword')?.clearValidators();
    this.managerForm.get('confirmPassword')?.updateValueAndValidity();
    
    this.isManagerModalOpen = true;
  }

  closeManagerModal() {
    this.isManagerModalOpen = false;
  }

  submitManager() {
    if (this.managerForm.invalid) return;

    this.isLoading = true;
    const formData = this.managerForm.value;

    if (this.isEditing && this.selectedManagerId) {
      if (!formData.password) {
          delete formData.password;
          delete formData.confirmPassword;
      }
      this.adminService.updateManager(this.selectedManagerId, formData).subscribe({
        next: () => {
          this.loadManagers();
          this.loadUsers(); 
          this.closeManagerModal();
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      this.adminService.createManager(formData).subscribe({
        next: () => {
          this.loadManagers();
          this.loadUsers();
          this.closeManagerModal();
          this.isLoading = false;
        },
        error: (err) => {
           console.error(err);
           this.isLoading = false;
        }
      });
    }
  }

  deleteManager(manager: any) {
    if(confirm(`Delete manager ${manager.prenom} ${manager.nom}?`)) {
       this.adminService.deleteManager(manager.id).subscribe({
        next: () => {
            this.loadManagers();
            this.loadUsers();
        },
        error: (err) => console.error(err)
       });
    }
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
