import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Order } from '../models/order.model';
import { map } from 'rxjs';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  ordersByStatus: Record<string, number>;
  recentOrders: Order[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/dashboard`;

  getStats() {
    return this.http.get<any>(`${this.url}/stats`)
      .pipe(map(res => res.data || res));
  }
}
