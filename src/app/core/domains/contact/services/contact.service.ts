import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { PageResponse } from '../../shared/models/page-response.model';
import { ContactMessage, UpdateContactStatusRequest } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/contact`;

  getAll(page: number = 0, size: number = 10, search?: string): Observable<PageResponse<ContactMessage>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PageResponse<ContactMessage>>(this.URL, { params });
  }

  updateStatus(idContactMessage: string, status: 'UNREAD' | 'READ' | 'REPLIED'): Observable<any> {
    return this.http.patch(`${this.URL}/${idContactMessage}/status`, { status });
  }

  deleteMessage(idContactMessage: string): Observable<any> {
    return this.http.delete(`${this.URL}/${idContactMessage}`);
  }
}
