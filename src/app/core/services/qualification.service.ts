import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Qualification, CreateQualificationRequest } from '../models/qualification.model';

@Injectable({ providedIn: 'root' })
export class QualificationService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/qualifications`;

  getByProduct(productId: string) {
    return this.http.get<Qualification[]>(`${this.url}/product/${productId}`);
  }

  getMy() {
    return this.http.get<Qualification[]>(`${this.url}/my`);
  }

  create(data: CreateQualificationRequest) {
    return this.http.post<Qualification>(this.url, data);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
