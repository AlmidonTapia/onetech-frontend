import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Order, CreateOrderRequest, OrderStatus, CreateOrderResponse } from '../../checkout/models/order.model';
import { PageResponse } from '../../shared/models/page-response.model';
import { ApiResponse } from '../../shared/models/api-response.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/orders`;

  getAll(page: number, size: number, search?: string, status?: string) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);
    return this.http.get<PageResponse<Order>>(this.url, { params });
  }

  getById(id: string) {
    return this.http.get<Order>(`${this.url}/${id}`);
  }

  getMyOrders(page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Order>>(`${this.url}/my`, { params });
  }

  create(data: CreateOrderRequest, idempotencyKey?: string) {
    const headers = idempotencyKey ? new HttpHeaders({ 'Idempotency-Key': idempotencyKey }) : undefined;
    return this.http.post<string>(this.url, data, { headers });
  }

  updateStatus(id: string, newStatus: OrderStatus) {
    return this.http.patch<ApiResponse<string>>(`${this.url}/${id}/status`, { newStatus });
  }
}
