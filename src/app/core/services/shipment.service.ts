import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Shipment, ShipmentMethod, CreateShipmentRequest, ShipmentStatus, CreateShipmentMethodRequest } from '../models/shipment.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/shipments`;
  private methodsUrl = `${environment.apiUrl}/shipment-methods`;

  getMethods() {
    return this.http.get<ShipmentMethod[]>(this.methodsUrl);
  }

  getAll(page = 0, size = 10) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Shipment>>(this.url, { params });
  }

  getByOrder(orderId: string) {
    return this.http.get<Shipment>(`${this.url}/order/${orderId}`);
  }

  create(data: CreateShipmentRequest) {
    return this.http.post<Shipment>(this.url, data);
  }

  updateStatus(id: string, newStatus: ShipmentStatus) {
    return this.http.patch<Shipment>(`${this.url}/${id}/status`, { newStatus });
  }

  updateArrival(id: string, estimatedArrival: string) {
    return this.http.patch<Shipment>(`${this.url}/${id}/arrival`, { estimatedArrival });
  }

  getById(id: string) {
    return this.http.get<Shipment>(`${this.url}/${id}`);
  }

  createMethod(data: CreateShipmentMethodRequest) {
    return this.http.post<ShipmentMethod>(this.methodsUrl, data);
  }

  getMethodById(id: string) {
    return this.http.get<ShipmentMethod>(`${this.methodsUrl}/${id}`);
  }
}
