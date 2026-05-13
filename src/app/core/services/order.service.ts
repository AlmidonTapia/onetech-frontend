import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderRequest, OrderStatus } from '../models/order.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/orders`;

  getAll(page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Order>>(this.url, { params });
  }

  getById(id: string) {
    return this.http.get<Order>(`${this.url}/${id}`);
  }

  getMyOrders(page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Order>>(`${this.url}/my`, { params });
  }

  create(data: CreateOrderRequest) {
    return this.http.post<Order>(this.url, data);
  }

  updateStatus(id: string, newStatus: OrderStatus) {
    return this.http.patch<Order>(`${this.url}/${id}/status`, { newStatus });
  }
}
