import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User, UpdateProfileRequest } from '../models/user.model';
import { Address, CreateAddressRequest } from '../models/address.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/users`;

  getProfile() {
    return this.http.get<User>(`${this.url}/profile`);
  }

  updateProfileDetails(data: UpdateProfileRequest) {
    return this.http.post<User>(`${this.url}/profile/details`, data);
  }

  getAllUsers(page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<User>>(this.url, { params });
  }

  // Addresses
  getAddresses() {
    return this.http.get<Address[]>(`${this.url}/address`);
  }

  addAddress(data: CreateAddressRequest) {
    return this.http.post<Address>(`${this.url}/address`, data);
  }

  deleteAddress(addressId: string) {
    return this.http.delete<void>(`${this.url}/address/${addressId}`);
  }
}
