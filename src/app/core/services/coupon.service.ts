import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Coupon, CreateCouponRequest } from '../models/coupon.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class CouponService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/coupons`;

  getAll(page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Coupon>>(this.url, { params });
  }

  getById(id: string) {
    return this.http.get<Coupon>(`${this.url}/${id}`);
  }

  create(data: CreateCouponRequest) {
    return this.http.post<Coupon>(this.url, data);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  validate(code: string) {
    return this.http.get<Coupon>(`${this.url}/validate/${code}`);
  }
}
