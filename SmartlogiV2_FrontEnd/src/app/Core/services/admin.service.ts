import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  getAllUsers(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(`${this.apiUrl}/users/all`, { params });
  }

  blockUser(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/block/${id}`, {}, { responseType: 'text' });
  }

  unblockUser(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/unblock/${id}`, {}, { responseType: 'text' });
  }

  
  getAllManagers(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(`${this.apiUrl}/manager/all`, { params });
  }

  createManager(managerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/manager/create`, managerData);
  }

  updateManager(id: string, managerData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/manager/update/${id}`, managerData);
  }

  deleteManager(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/manager/delete/${id}`, { responseType: 'text' });
  }

  
  getAllRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/roles/all`);
  }

  createRole(roleData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/roles/create`, roleData);
  }

  updateRole(id: string, roleData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/roles/update/${id}`, roleData);
  }

  deleteRole(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/roles/delete/${id}`, { responseType: 'text' });
  }

  
  getAllPermissions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/permission/all`);
  }

  createPermission(permissionData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/permission/create`, permissionData);
  }

  deletePermission(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/permission/delete/${id}`, { responseType: 'text' });
  }

  assignPermission(roleId: string, permissionId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Roles/AssignPermission`, { roleId, permissionId });
  }

  unassignPermission(roleId: string, permissionId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Roles/UnassignPermission`, { roleId, permissionId });
  }
}
