import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StoreConfiguration {
  companyName: string;
  taxId: string;
  address: string;
  supportEmail: string;
  supportPhone: string;
  logoUrl: string;
  igvPercentage: number;
  freeShippingThreshold: number;
  orderExpirationMinutes: number;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class StoreConfigService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/store/config`;

  getConfiguration(): Observable<StoreConfiguration> {
    return this.http.get<any>(this.url).pipe(
      map(res => res.data || res)
    );
  }

  updateConfiguration(data: Partial<StoreConfiguration>): Observable<void> {
    return this.http.put<void>(this.url, data);
  }
}
