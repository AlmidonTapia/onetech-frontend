import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PageResponse } from '../../shared/models/page-response.model';

export interface Invoice {
  idInvoice: string;
  idOrder: string;
  invoiceNumber: string;
  totalAmount: number;
  pdfUrl: string;
  status: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/invoices`;

  getMyInvoices(page = 0, size = 10): Observable<PageResponse<Invoice>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(`${this.url}/my`, { params }).pipe(
      map(res => res.data || res)
    );
  }

  getByOrder(idOrder: string): Observable<Invoice> {
    return this.http.get<any>(`${this.url}/order/${idOrder}`).pipe(
      map(res => res.data || res)
    );
  }

  getById(idInvoice: string): Observable<Invoice> {
    return this.http.get<any>(`${this.url}/${idInvoice}`).pipe(
      map(res => res.data || res)
    );
  }

  downloadInvoiceUrl(idInvoice: string): string {
    return `${this.url}/${idInvoice}/download`;
  }

  getAll(page = 0, size = 10): Observable<PageResponse<Invoice>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(this.url, { params }).pipe(
      map(res => res.data || res)
    );
  }

  annul(idInvoice: string): Observable<any> {
    return this.http.patch<any>(`${this.url}/${idInvoice}/annul`, {});
  }

  sendEmail(idInvoice: string): Observable<any> {
    return this.http.post<any>(`${this.url}/${idInvoice}/send`, {});
  }
}
