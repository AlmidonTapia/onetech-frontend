import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Product, CreateProductRequest, ProductFilters } from '../models/product.model';
import { PageResponse } from '../../shared/models/page-response.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/products`;

  getAll(filters: ProductFilters = {}): Observable<PageResponse<Product>> {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('size', filters.size ?? 12);
    if (filters.idCategory != null && filters.idCategory !== '') params = params.set('idCategory', filters.idCategory);
    if (filters.idBrand != null && filters.idBrand !== '')       params = params.set('idBrand', filters.idBrand);
    if (filters.minPrice != null)  params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice != null)  params = params.set('maxPrice', filters.maxPrice);
    if (filters.search)            params = params.set('search', filters.search);
    if (filters.badge)             params = params.set('badge', filters.badge);
    if (filters.status)            params = params.set('status', filters.status);

    const sortMapping: Record<string, string> = {
      'price_asc':  'price,asc',
      'price_desc': 'price,desc',
      'name_asc':   'productName,asc',
      'newest':     'createdAt,desc'
    };
    if (filters.sort && sortMapping[filters.sort]) {
      params = params.set('sort', sortMapping[filters.sort]);
    }

    const cacheKey = `products_${params.toString()}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      return of(JSON.parse(cached));
    }

    return this.http.get<PageResponse<Product>>(this.url, { params }).pipe(
      tap(res => sessionStorage.setItem(cacheKey, JSON.stringify(res)))
    );
  }

  getById(id: string) {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  create(data: CreateProductRequest) {
    return this.http.post<{ id: string }>(this.url, data).pipe(
      tap(() => this.clearCache())
    );
  }

  update(id: string, data: Partial<CreateProductRequest>) {
    return this.http.put<Product>(`${this.url}/${id}`, data).pipe(
      tap(() => this.clearCache())
    );
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  uploadImages(productId: string, files: File[], principalIndex: number) {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    formData.append('isPrincipalIndex', principalIndex.toString());
    return this.http.post(`${this.url}/${productId}/images`, formData).pipe(
      tap(() => this.clearCache())
    );
  }

  getImages(productId: string) {
    return this.http.get<any[]>(`${this.url}/${productId}/images`);
  }

  deleteImage(productId: string, imageId: string) {
    return this.http.delete<void>(`${this.url}/${productId}/images/${imageId}`).pipe(
      tap(() => this.clearCache())
    );
  }

  setPrincipalImage(productId: string, imageId: string) {
    return this.http.put<void>(`${this.url}/${productId}/images/${imageId}/principal`, {}).pipe(
      tap(() => this.clearCache())
    );
  }

  private clearCache() {
    const keysToClear = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('products_')) {
        keysToClear.push(key);
      }
    }
    keysToClear.forEach(key => sessionStorage.removeItem(key));
  }
}
