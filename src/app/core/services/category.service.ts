import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category, CreateCategoryRequest } from '../models/category.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/categories`;

  getAll(page = 0, size = 50, search?: string) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    return this.http.get<PageResponse<Category>>(this.url, { params });
  }

  getById(id: string) {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  create(data: CreateCategoryRequest) {
    return this.http.post<Category>(this.url, data).pipe(
      tap(() => sessionStorage.removeItem('category_tree'))
    );
  }

  getTree(): Observable<any[]> {
    const cached = sessionStorage.getItem('category_tree');
    if (cached) {
      return of(JSON.parse(cached));
    }

    return this.http.get<any[]>(`${this.url}/tree`).pipe(
      tap(res => sessionStorage.setItem('category_tree', JSON.stringify(res)))
    );
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, data).pipe(
      tap(() => sessionStorage.removeItem('category_tree'))
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`).pipe(
      tap(() => sessionStorage.removeItem('category_tree'))
    );
  }
}
