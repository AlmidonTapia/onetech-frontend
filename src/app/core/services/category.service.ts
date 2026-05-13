import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Category, CreateCategoryRequest } from '../models/category.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/categories`;

  getAll(page = 0, size = 50) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Category>>(this.url, { params });
  }

  getById(id: string) {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  create(data: CreateCategoryRequest) {
    return this.http.post<Category>(this.url, data);
  }
}
