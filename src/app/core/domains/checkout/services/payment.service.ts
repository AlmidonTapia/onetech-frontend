import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Payment, PaymentMethod, CreatePaymentRequest, CreatePaymentMethodRequest, ProcessMpPaymentRequest } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/payments`;
  private methodsUrl = `${environment.apiUrl}/payment-methods`;

  getMethods(search?: string) {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<PaymentMethod[]>(this.methodsUrl, { params });
  }

  getByOrder(orderId: string) {
    return this.http.get<Payment>(`${this.url}/order/${orderId}`);
  }

  register(data: CreatePaymentRequest, idempotencyKey?: string) {
    const headers = idempotencyKey ? new HttpHeaders({ 'Idempotency-Key': idempotencyKey }) : undefined;
    return this.http.post<string>(this.url, data, { headers });
  }

  createMethod(data: CreatePaymentMethodRequest) {
    return this.http.post<PaymentMethod>(this.methodsUrl, data);
  }

  updateMethod(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.methodsUrl}/${id}`, data);
  }

  deleteMethod(id: string): Observable<any> {
    return this.http.delete<any>(`${this.methodsUrl}/${id}`);
  }

  processMpPayment(data: ProcessMpPaymentRequest, idempotencyKey?: string): Observable<any> {
    const headers = idempotencyKey ? new HttpHeaders({ 'Idempotency-Key': idempotencyKey }) : undefined;
    return this.http.post<any>(`${this.url}/process-mp`, data, { headers });
  }
}
