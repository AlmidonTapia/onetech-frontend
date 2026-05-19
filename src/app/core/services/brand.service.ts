import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Brand, CreateBrandRequest } from '../models/brand.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class BrandService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/brands`;

  getAll(page = 0, size = 50) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Brand>>(this.url, { params });
  }

  getById(id: string) {
    return this.http.get<Brand>(`${this.url}/${id}`);
  }

  create(data: CreateBrandRequest) {
    return this.http.post<Brand>(this.url, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
