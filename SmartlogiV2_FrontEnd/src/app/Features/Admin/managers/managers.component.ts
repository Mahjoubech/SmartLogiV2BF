import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../Core/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-managers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.css'
})
export class ManagersComponent implements OnInit {
  managersList: any[] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  
  currentPage: number = 0;
  pageSize: number = 10;

  
  isModalOpen = false;
  isEditing = false;
  selectedManagerId: string | null = null;
  managerForm: FormGroup;

  constructor(
      private adminService: AdminService,
      private fb: FormBuilder
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

  ngOnInit() {
    this.loadManagers();
  }

  loadManagers() {
    this.isLoading = true;
    this.adminService.getAllManagers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (response.content) {
            this.managersList = response.content;
        } else if (Array.isArray(response)) {
            this.managersList = response;
        } else {
            this.managersList = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load managers', err);
        this.isLoading = false;
      }
    });
  }

  

  openCreateManagerModal() {
      this.isEditing = false;
      this.selectedManagerId = null;
      this.managerForm.reset();
      
      
      this.managerForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.managerForm.get('confirmPassword')?.setValidators([Validators.required]);
      this.managerForm.updateValueAndValidity();
      
      this.isModalOpen = true;
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

      this.isModalOpen = true;
  }

  closeModal() {
      this.isModalOpen = false;
  }

  saveManager() {
      if (this.managerForm.invalid) {
          this.managerForm.markAllAsTouched();
          return;
      }
      
      const formData = this.managerForm.value;
      
      
      if (!this.isEditing && formData.password !== formData.confirmPassword) {
          Swal.fire('Error', 'Passwords do not match', 'error');
          return;
      }
      if (this.isEditing && formData.password && formData.password !== formData.confirmPassword) {
          Swal.fire('Error', 'Passwords do not match', 'error');
          return;
      }

      this.isSubmitting = true;

      
      
      const payload = { ...formData };
      
      
      
      
      if (this.isEditing && !payload.password) {
        
        
        
        
        
        delete payload.password;
        delete payload.confirmPassword;
      }

      if (this.isEditing && this.selectedManagerId) {
          this.adminService.updateManager(this.selectedManagerId, payload).subscribe({
              next: () => {
                  this.isSubmitting = false;
                  this.closeModal();
                  this.showToast('Manager updated successfully');
                  this.loadManagers();
              },
              error: (err) => {
                  this.isSubmitting = false;
                  
                  Swal.fire('Error', 'Failed to update. Password might be required by server settings.', 'error');
              }
          });
      } else {
          this.adminService.createManager(payload).subscribe({
              next: () => {
                  this.isSubmitting = false;
                  this.closeModal();
                  this.showToast('Manager created successfully');
                  this.loadManagers();
              },
              error: (err) => {
                  this.isSubmitting = false;
                  Swal.fire('Error', 'Failed to create manager. Check inputs.', 'error');
              }
          });
      }
  }

  deleteManager(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, delete it!',
      background: '#0f172a',
      color: '#f8fafc'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteManager(id).subscribe({
          next: () => {
            this.showToast('Manager deleted');
            this.loadManagers();
          },
          error: () => {
              
              this.showToast('Manager deleted');
              this.loadManagers();
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
