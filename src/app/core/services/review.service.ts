import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Review, CreateReviewRequest } from '../models/review.model';
import { PageResponse } from '../models/page-response.model';
import { ApiResponse } from '../models/api-response.model';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/reviews`;

  getByProduct(productId: string, page = 0, size = 10) {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<PageResponse<Review>>(`${this.url}/product/${productId}`, { params });
  }

  create(data: CreateReviewRequest) {
    return this.http.post<ApiResponse<string>>(this.url, data);
  }

  getAll(page = 0, size = 10) {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<PageResponse<Review>>(this.url, { params });
  }

  getAllReviews(page = 0, size = 10, search?: string, rating?: number, status?: string): Observable<PageResponse<Review>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    if (rating) params = params.set('rating', rating.toString());
    if (status) params = params.set('status', status);
    return this.http.get<PageResponse<Review>>(this.url, { params });
  }

  updateStatus(idReview: string, status: string) {
    return this.http.put<ApiResponse<string>>(`${this.url}/${idReview}/status`, { status });
  }

  delete(idReview: string) {
    return this.http.delete<ApiResponse<string>>(`${this.url}/${idReview}`);
  }
}
