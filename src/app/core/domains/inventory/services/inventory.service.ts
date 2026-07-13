import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { InventoryMovement, CreateInventoryMovementRequest } from '../models/inventory.model';
import { PageResponse } from '../../shared/models/page-response.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/inventory/movements`;

  getAll(page = 0, size = 10, search?: string, type?: string) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    if (type) params = params.set('type', type);
    return this.http.get<PageResponse<InventoryMovement>>(this.url, { params });
  }

  getById(id: string) {
    return this.http.get<InventoryMovement>(`${this.url}/${id}`);
  }

  register(data: CreateInventoryMovementRequest) {
    return this.http.post<InventoryMovement>(this.url, data);
  }

  getByProduct(productId: string, page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<InventoryMovement>>(`${this.url}/product/${productId}`, { params });
  }

  cancel(id: string) {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
