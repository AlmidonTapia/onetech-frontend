import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { User, UpdateProfileRequest, ChangePasswordRequest } from '../models/user.model';
import { Address, CreateAddressRequest } from '../../shipping/models/address.model';
import { PageResponse } from '../../shared/models/page-response.model';
import { ApiResponse } from '../../shared/models/api-response.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/users`;

  getProfile() {
    return this.http.get<User>(`${this.url}/profile`);
  }

  updateProfileDetails(data: UpdateProfileRequest) {
    return this.http.post<ApiResponse<string>>(`${this.url}/profile/details`, data);
  }

  changePassword(data: ChangePasswordRequest) {
    return this.http.post<ApiResponse<string>>(`${this.url}/profile/password`, data);
  }

  getAllUsers(page = 0, size = 10, search?: string, role?: string, status?: string) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    if (role) params = params.set('role', role);
    if (status) params = params.set('status', status);
    return this.http.get<PageResponse<User>>(this.url, { params });
  }

  getAddresses() {
    return this.http.get<Address[]>(`${this.url}/address`);
  }

  addAddress(data: CreateAddressRequest) {
    return this.http.post<ApiResponse<string>>(`${this.url}/address`, data);
  }

  deleteAddress(addressId: string) {
    return this.http.delete<ApiResponse<string>>(`${this.url}/address/${addressId}`);
  }
}
