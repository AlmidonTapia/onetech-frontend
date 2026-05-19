import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Payment, PaymentMethod, CreatePaymentRequest, CreatePaymentMethodRequest } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/payments`;
  private methodsUrl = `${environment.apiUrl}/payment-methods`;

  getMethods() {
    return this.http.get<PaymentMethod[]>(this.methodsUrl);
  }

  getByOrder(orderId: string) {
    return this.http.get<Payment>(`${this.url}/order/${orderId}`);
  }

  register(data: CreatePaymentRequest) {
    return this.http.post<Payment>(this.url, data);
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
}
