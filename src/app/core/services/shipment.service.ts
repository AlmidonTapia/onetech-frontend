import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Shipment, ShipmentMethod, CreateShipmentRequest, ShipmentStatus, CreateShipmentMethodRequest } from '../models/shipment.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/shipments`;
  private methodsUrl = `${environment.apiUrl}/shipment-methods`;

  private mapShipment(s: any): Shipment {
    return {
      ...s,
      status: s.shipmentStatus || s.status
    };
  }

  getMethods(activeOnly = false) {
    let params = new HttpParams();
    if (activeOnly) {
      params = params.set('activeOnly', 'true');
    }
    return this.http.get<ShipmentMethod[]>(this.methodsUrl, { params });
  }

  getAll(page = 0, size = 10): Observable<PageResponse<Shipment>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Shipment>>(this.url, { params }).pipe(
      map(res => {
        if (res && res.content) {
          res.content = res.content.map(s => this.mapShipment(s));
        }
        return res;
      })
    );
  }

  getByOrder(orderId: string): Observable<Shipment> {
    return this.http.get<any>(`${this.url}/order/${orderId}`).pipe(
      map(res => {
        const raw = (res && res.data) ? res.data : res;
        return this.mapShipment(raw);
      })
    );
  }

  create(data: CreateShipmentRequest): Observable<Shipment> {
    return this.http.post<any>(this.url, data).pipe(
      map(res => {
        const raw = (res && res.data) ? res.data : res;
        return this.mapShipment(raw);
      })
    );
  }

  updateStatus(id: string, newStatus: ShipmentStatus): Observable<Shipment> {
    return this.http.patch<any>(`${this.url}/${id}/status`, { newStatus }).pipe(
      map(res => {
        const raw = (res && res.data) ? res.data : res;
        return this.mapShipment(raw);
      })
    );
  }

  updateArrival(id: string, estimatedArrival: string, shippingCost?: number, trackingNumber?: string): Observable<Shipment> {
    return this.http.patch<any>(`${this.url}/${id}/arrival`, { estimatedArrival, shippingCost, trackingNumber }).pipe(
      map(res => {
        const raw = (res && res.data) ? res.data : res;
        return this.mapShipment(raw);
      })
    );
  }

  getById(id: string): Observable<Shipment> {
    return this.http.get<any>(`${this.url}/${id}`).pipe(
      map(res => {
        const raw = (res && res.data) ? res.data : res;
        return this.mapShipment(raw);
      })
    );
  }

  createMethod(data: CreateShipmentMethodRequest) {
    return this.http.post<ShipmentMethod>(this.methodsUrl, data);
  }

  getMethodById(id: string) {
    return this.http.get<ShipmentMethod>(`${this.methodsUrl}/${id}`);
  }

  updateMethod(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.methodsUrl}/${id}`, data);
  }

  deleteMethod(id: string): Observable<any> {
    return this.http.delete<any>(`${this.methodsUrl}/${id}`);
  }
}
