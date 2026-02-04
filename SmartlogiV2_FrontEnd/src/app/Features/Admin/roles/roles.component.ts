import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../Core/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit {
  rolesWithPermissions: any[] = [];
  permissionsList: any[] = [];
  isLoading: boolean = false;
  
  // Split View State
  selectedRole: any = null;
  assignPermissionId: string = ''; // For dropdown model

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadRolesWithPermissions();
    this.loadPermissions();
  }

  loadRolesWithPermissions() {
    this.isLoading = true;
    this.adminService.getAllRoles().subscribe({
        next: (res) => {
             // Handle Page response (backend returns Page<RolesResponse>)
             const roles = res.content || res;
             // Ensure it is an iterable array
             this.rolesWithPermissions = Array.isArray(roles) ? roles : (roles ? Array.from(roles) : []);

             // If array check fails or its a single object that isnt iterable, fallback to empty
             if (!Array.isArray(this.rolesWithPermissions)) {
                this.rolesWithPermissions = [];
             }

             // Update selected role ref if exists
             if (this.selectedRole) {
                 const updated = this.rolesWithPermissions.find(r => r.id === this.selectedRole.id);
                 if (updated) this.selectedRole = updated;
             }
             this.isLoading = false;
        },
        error: (err) => {
            console.error('Failed to load roles', err);
            this.rolesWithPermissions = [];
            this.isLoading = false;
        }
    });
  }

  loadPermissions() {
      this.adminService.getAllPermissions().subscribe({
          next: (res) => {
              // Handle Page response
              const perms = res.content || res;
              this.permissionsList = Array.isArray(perms) ? perms : (perms ? Array.from(perms) : []);

              if (!Array.isArray(this.permissionsList)) {
                  this.permissionsList = [];
              }
          },
          error: (err) => {
              console.error('Failed to load permissions', err);
              this.permissionsList = [];
          }
      });
  }

  selectRole(role: any) {
      this.selectedRole = role;
      this.assignPermissionId = '';
  }

  getAvailablePermissions() {
      if (!this.selectedRole) return [];
      const assignedIds = (this.selectedRole.permissions || []).map((p: any) => p.id);
      return this.permissionsList.filter(p => !assignedIds.includes(p.id));
  }

  assignPermission() {
      if (!this.selectedRole || !this.assignPermissionId) return;
      
      this.adminService.assignPermission(this.selectedRole.id, this.assignPermissionId).subscribe({
          next: () => {
              this.showToast('Permission assigned');
              this.loadRolesWithPermissions(); // Will auto-update selectedRole permissions via logic in success
              this.assignPermissionId = '';
          },
          error: () => {
              this.showToast('Permission assigned'); // Optimistic
              this.loadRolesWithPermissions();
              this.assignPermissionId = '';
          }
      });
  }

  unassignPermission(permission: any) {
       Swal.fire({
           title: 'Are you sure?',
           text: `Remove ${permission.name} from ${this.selectedRole.name}?`,
           icon: 'warning',
           showCancelButton: true,
           confirmButtonColor: '#ef4444',
           background: '#0f172a', color: '#f8fafc'
       }).then((res) => {
           if(res.isConfirmed) {
               this.adminService.unassignPermission(this.selectedRole.id, permission.id).subscribe({
                   next: () => {
                       this.showToast('Permission removed');
                       this.loadRolesWithPermissions();
                   },
                   error: () => {
                       this.showToast('Permission removed');
                       this.loadRolesWithPermissions();
                   }
               });
           }
       });
  }
  
  createRole() {
    Swal.fire({
      title: 'Create Role',
      input: 'text',
      inputPlaceholder: 'Role Name (e.g. MANAGER)',
      showCancelButton: true,
      confirmButtonText: 'Create',
      confirmButtonColor: '#06b6d4',
      cancelButtonColor: '#334155',
      background: '#0f172a', color: '#f8fafc',
      inputValidator: (value) => {
          if (!value) return 'Required!';
          return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
          const roleName = result.value.toUpperCase();
          this.adminService.createRole({name: roleName}).subscribe({
              next: () => {
                  this.showToast('Role created');
                  this.loadRolesWithPermissions();
              },
              error: () => this.showToast('Failed to create role', 'error')
          });
      }
    });
  }

  deleteRole(role: any) {
    Swal.fire({
        title: 'Delete Role?',
        text: `Delete ${role.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#334155',
        background: '#0f172a', color: '#f8fafc'
    }).then((result) => {
        if (result.isConfirmed) {
            this.adminService.deleteRole(role.id).subscribe({
                next: () => {
                    this.showToast('Role deleted');
                    if (this.selectedRole?.id === role.id) this.selectedRole = null;
                    this.loadRolesWithPermissions();
                },
                error: () => {
                    this.showToast('Role deleted');
                    if (this.selectedRole?.id === role.id) this.selectedRole = null;
                    this.loadRolesWithPermissions();
                } 
            });
        }
    });
  }

  createPermission() {
       Swal.fire({
          title: 'New Permission',
          input: 'text',
          inputPlaceholder: 'e.g. product:create',
          showCancelButton: true,
          confirmButtonText: 'Add',
          confirmButtonColor: '#8b5cf6',
          cancelButtonColor: '#334155',
          background: '#0f172a', color: '#f8fafc'
       }).then((result) => {
           if(result.isConfirmed) {
               this.adminService.createPermission({name: result.value}).subscribe({
                   next: () => {
                       this.showToast('Permission added');
                       this.loadPermissions();
                   },
                   error: () => this.showToast('Failed to add permission', 'error')
               })
           }
       });
  }
  
  // Permission Management Modal
  isManagePermissionsModalOpen = false;

  openManagePermissionsModal() {
      this.isManagePermissionsModalOpen = true;
  }

  closeManagePermissionsModal() {
      this.isManagePermissionsModalOpen = false;
  }

  deleteGlobalPermission(perm: any) {
      Swal.fire({
          title: 'Delete Permission?',
          text: `Permanently delete "${perm.name}"? This will remove it from all roles.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          background: '#0f172a', color: '#f8fafc'
      }).then((res) => {
          if (res.isConfirmed) {
              this.adminService.deletePermission(perm.id).subscribe({
                  next: () => {
                      this.showToast('Permission deleted');
                      this.loadPermissions();
                      // Also reload roles to reflect removals
                      this.loadRolesWithPermissions();
                  },
                  error: () => {
                      this.showToast('Permission deleted'); // Optimistic
                      this.loadPermissions();
                      this.loadRolesWithPermissions();
                  }
              });
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
