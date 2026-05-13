import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Payment, PaymentMethod, CreatePaymentRequest } from '../models/payment.model';

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
}
