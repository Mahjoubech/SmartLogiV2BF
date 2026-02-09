import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../../Core/services/auth.service';
import { AdminService } from '../../../Core/services/admin.service';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import Swal from 'sweetalert2';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'stats' | 'clients' | 'managers' | 'roles' = 'stats';
  
  
  allClients: any[] = []; 
  clientsList: any[] = [];
  managersList: any[] = [];
  rolesList: any[] = [];
  
  
  searchTerm: string = '';

  
  currentUser: any = null;
  tokenExpiration: Date | null = null;
  
  
  stats = {
    totalUsers: 0,
    totalClients: 0,
    activeManagers: 0,
    blockedUsers: 0
  };

  
  managerForm: FormGroup;
  
  
  isManagerModalOpen = false;
  isEditing = false;
  selectedManagerId: string | null = null;
  isLoading = false;

  
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
    this.currentUser = this.authService.currentUserValue;
    this.calculateTokenExpiration();
    this.loadData();
  }

  calculateTokenExpiration() {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp) {
          this.tokenExpiration = new Date(payload.exp * 1000);
        }
      } catch (e) {
        console.error('Failed to parse token expiry', e);
      }
    }
  }

  filterClients() {
    if (!this.searchTerm) {
      this.clientsList = [...this.allClients];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.clientsList = this.allClients.filter(client => 
        client.nom?.toLowerCase().includes(term) || 
        client.prenom?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term)
      );
    }
  }

  loadData() {
    this.loadUsers(); 
    this.loadRoles();
  }

  loadUsers() {
    this.adminService.getAllUsers(0, 100).subscribe({
      next: (data) => {
        const allUsers = data.content;
        
        
        this.clientsList = allUsers.filter((u: any) => u.role?.name === 'CLIENT');
        
        
        
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

  
  permissionsList: any[] = [];
  selectedRole: any = null;
  activeSubTab: 'roles' | 'permissions' = 'roles';

  loadRoles() {
    this.adminService.getAllRoles().subscribe({
      next: (data) => {
        this.rolesList = data.content || []; 
      },
      error: (err) => console.error('Error loading roles', err)
    });

    this.loadPermissions();
  }

  loadPermissions() {
    this.adminService.getAllPermissions().subscribe({
      next: (data) => {
        this.permissionsList = data.content || [];
      },
      error: (err) => console.error('Error loading permissions', err)
    });
  }

  
  createPermission() {
    Swal.fire({
      title: 'Create New Permission',
      input: 'text',
      inputLabel: 'Permission Name',
      inputPlaceholder: 'e.g. MANAGE_DISPATCH',
      showCancelButton: true,
      confirmButtonText: 'Create',
      confirmButtonColor: '#06b6d4',
      cancelButtonColor: '#334155',
      background: '#0f172a',
      color: '#f8fafc',
      inputValidator: (value) => {
        if (!value) return 'Permission name is required!';
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.createPermission({ name: result.value }).subscribe({
          next: () => {
            this.loadPermissions();
            Swal.fire({ title: 'Created!', icon: 'success', background: '#0f172a', color: '#f8fafc' });
          },
          error: () => Swal.fire('Error', 'Failed to create permission', 'error')
        });
      }
    });
  }

  deletePermission(permission: any) {
    Swal.fire({
      title: 'Delete Permission?',
      text: `Are you sure you want to delete ${permission.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it',
      background: '#0f172a',
      color: '#f8fafc'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deletePermission(permission.id).subscribe({
            next: () => {
                this.loadPermissions();
                Swal.fire({ title: 'Deleted!', icon: 'success', background: '#0f172a', color: '#f8fafc' });
            },
            error: () => Swal.fire('Error', 'Failed to delete permission', 'error')
        });
      }
    });
  }

  
  createRole() {
    Swal.fire({
      title: 'Create New Role',
      input: 'text',
      inputLabel: 'Role Name',
      inputPlaceholder: 'e.g. SUPERVISOR',
      showCancelButton: true,
      confirmButtonText: 'Create',
      confirmButtonColor: '#06b6d4',
      cancelButtonColor: '#334155',
      background: '#0f172a',
      color: '#f8fafc',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write a role name!'
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.createRole({ name: result.value }).subscribe({
          next: () => {
            this.loadRoles();
            Swal.fire({
              title: 'Created!',
              text: 'Role has been created.',
              icon: 'success',
              background: '#0f172a',
              color: '#f8fafc'
            });
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to create role', 'error');
          }
        });
      }
    });
  }

  deleteRole(role: any) {
    Swal.fire({
      title: 'Delete Role?',
      text: `Are you sure you want to delete ${role.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, delete it',
      background: '#0f172a',
      color: '#f8fafc'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteRole(role.id).subscribe({
          next: () => {
            this.loadRoles();
            if (this.selectedRole?.id === role.id) {
              this.selectedRole = null;
            }
            Swal.fire({
              title: 'Deleted!',
              text: 'Role has been deleted.',
              icon: 'success',
              background: '#0f172a',
              color: '#f8fafc'
            });
          },
          error: (err) => Swal.fire('Error', 'Failed to delete role', 'error')
        });
      }
    });
  }

  
  onSelectRole(role: any) {
    this.selectedRole = { ...role };
  }

  getAvailablePermissions() {
    if (!this.selectedRole) return [];
    if (!this.selectedRole.permissions) return this.permissionsList;
    
    const assignedIds = this.selectedRole.permissions.map((p: any) => p.id);
    return this.permissionsList.filter(p => !assignedIds.includes(p.id));
  }

  assignPermissionToSelectedRole(permissionId: string) {
      if (!this.selectedRole) return;
      
      this.adminService.assignPermission(this.selectedRole.id, permissionId).subscribe({
          next: (updatedRole) => {
             
             
             
             this.loadRoles();
             
             
             
             const perm = this.permissionsList.find(p => p.id === permissionId);
             if (perm) {
                if(!this.selectedRole.permissions) this.selectedRole.permissions = [];
                this.selectedRole.permissions.push(perm);
             }

             Swal.fire({ title: 'Assigned', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: '#0f172a', color: '#f8fafc' });
          },
          error: (err) => Swal.fire('Error', 'Failed to assign permission', 'error')
      });
  }

  unassignPermissionFromSelectedRole(permission: any) {
      if (!this.selectedRole) return;

      Swal.fire({
          title: 'Unassign Permission?',
          text: `Remove ${permission.name} from ${this.selectedRole.name}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#334155',
          confirmButtonText: 'Yes, remove',
          background: '#0f172a',
          color: '#f8fafc'
      }).then((result) => {
          if (result.isConfirmed) {
              this.adminService.unassignPermission(this.selectedRole.id, permission.id).subscribe({
                  next: () => {
                      this.loadRoles();
                      
                      this.selectedRole.permissions = this.selectedRole.permissions.filter((p: any) => p.id !== permission.id);
                      
                      Swal.fire({ title: 'Removed', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, background: '#0f172a', color: '#f8fafc' });
                  },
                  error: (err) => Swal.fire('Error', 'Failed to remove permission', 'error')
              });
          }
      });
  }

  async openAssignModal() {
    const available = this.getAvailablePermissions();
    if (available.length === 0) {
        Swal.fire({ title: 'No Permissions', text: 'All available permissions are already assigned.', icon: 'info', background: '#0f172a', color: '#f8fafc' });
        return;
    }

    const inputOptions: any = {};
    available.forEach(p => {
        inputOptions[p.id] = p.name;
    });

    const { value: permissionId } = await Swal.fire({
        title: 'Assign Permission',
        input: 'select',
        inputOptions: inputOptions,
        inputPlaceholder: 'Select a permission',
        background: '#0f172a',
        color: '#f8fafc',
        showCancelButton: true,
        confirmButtonColor: '#06b6d4',
        cancelButtonColor: '#334155'
    });

    if (permissionId) {
        this.assignPermissionToSelectedRole(permissionId);
    }
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
            this.stats.totalUsers - (this.stats.totalClients + this.stats.activeManagers) 
          ],
          backgroundColor: [
            '#06b6d4', 
            '#8b5cf6', 
            '#22c55e'  
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

  

  editClient(client: any) {
    Swal.fire({
      title: 'Feature Coming Soon',
      text: `Editing details for ${client.prenom} ${client.nom} is under development.`,
      icon: 'info',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#06b6d4'
    });
  }

  assignRole(client: any) {
    Swal.fire({
      title: 'Assign Role',
      text: `Change role for ${client.prenom} ${client.nom}?`,
      input: 'select',
      inputOptions: {
        'CLIENT': 'Client',
        'LIVREUR': 'Livreur',
        'MANAGER': 'Manager'
      },
      showCancelButton: true,
      confirmButtonText: 'Update Role',
      confirmButtonColor: '#8b5cf6',
      cancelButtonColor: '#334155',
      background: '#0f172a',
      color: '#f8fafc',
      inputPlaceholder: 'Select a role'
    }).then((result) => {
      if (result.isConfirmed) {
        
        console.log('Role update requested:', result.value);
        Swal.fire({
          title: 'Request Sent',
          text: 'Role assignment feature is coming in the next update.',
          icon: 'success',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    });
  }

  toggleBlockUser(user: any, block: boolean) {
    const action = block ? 'block' : 'unblock';
    
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to ${action} access for ${user.prenom} ${user.nom}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: block ? '#ef4444' : '#22c55e', 
      cancelButtonColor: '#334155',
      confirmButtonText: `Yes, ${action} user`,
      background: '#0f172a',
      color: '#f8fafc'
    }).then((result) => {
      if (result.isConfirmed) {
        if (block) {
          this.adminService.blockUser(user.id).subscribe({
            next: () => {
              this.loadUsers();
              Swal.fire({
                title: 'Blocked!',
                text: 'User has been blocked successfully.',
                icon: 'success',
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#06b6d4'
              });
            },
            error: (err) => {
               console.error('Block failed', err);
               Swal.fire({
                title: 'Error!',
                text: 'Failed to block user.',
                icon: 'error',
                background: '#0f172a',
                color: '#f8fafc'
               });
            }
          });
        } else {
          this.adminService.unblockUser(user.id).subscribe({
            next: () => {
              this.loadUsers();
              Swal.fire({
                title: 'Unblocked!',
                text: 'User access has been restored.',
                icon: 'success',
                background: '#0f172a',
                color: '#f8fafc',
                confirmButtonColor: '#06b6d4'
              });
            },
            error: (err) => {
               console.error('Unblock failed', err);
               Swal.fire({
                title: 'Error!',
                 text: 'Failed to unblock user.',
                 icon: 'error',
                 background: '#0f172a',
                 color: '#f8fafc'
               });
            }
          });
        }
      }
    });
  }

  
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
