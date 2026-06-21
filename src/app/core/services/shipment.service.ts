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

  getMethods(activeOnly = false, search?: string) {
    let params = new HttpParams();
    if (activeOnly) {
      params = params.set('activeOnly', 'true');
    }
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any>(this.methodsUrl, { params }).pipe(
      map(res => res.data || res)
    );
  }

  getAll(page = 0, size = 10, search?: string): Observable<PageResponse<Shipment>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    return this.http.get<any>(this.url, { params }).pipe(
      map(res => {
        const data = res.data || res;
        if (data && data.content) {
          data.content = data.content.map((s: any) => this.mapShipment(s));
        }
        return data;
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

  updateArrival(id: string, estimatedArrival?: string, shippingCost?: number, trackingNumber?: string): Observable<Shipment> {
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
    return this.http.post<any>(this.methodsUrl, data).pipe(map(res => res.data || res));
  }

  getMethodById(id: string) {
    return this.http.get<any>(`${this.methodsUrl}/${id}`).pipe(map(res => res.data || res));
  }

  updateMethod(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.methodsUrl}/${id}`, data).pipe(map(res => res.data || res));
  }

  deleteMethod(id: string): Observable<any> {
    return this.http.delete<any>(`${this.methodsUrl}/${id}`).pipe(map(res => res.data || res));
  }
  // --- Shipping Rates API ---
  private ratesUrl = `${environment.apiUrl}/shipping-rates`;
  
  getRates(page = 0, size = 10, idShipmentMethod?: string): Observable<PageResponse<any>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (idShipmentMethod) params = params.set('idShipmentMethod', idShipmentMethod);
    return this.http.get<any>(this.ratesUrl, { params }).pipe(map(res => res.data || res));
  }

  createRate(data: any): Observable<any> {
    return this.http.post<any>(this.ratesUrl, data).pipe(map(res => res.data || res));
  }

  updateRate(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.ratesUrl}/${id}`, data).pipe(map(res => res.data || res));
  }

  deleteRate(id: number): Observable<any> {
    return this.http.delete<any>(`${this.ratesUrl}/${id}`).pipe(map(res => res.data || res));
  }

  // --- Ubigeo API ---
  private ubigeoUrl = `${environment.apiUrl}/ubigeo`;

  getDepartments(): Observable<any[]> {
    return this.http.get<any>(`${this.ubigeoUrl}/departments`).pipe(map(res => res.data || res));
  }

  getProvinces(idDepartment: string): Observable<any[]> {
    return this.http.get<any>(`${this.ubigeoUrl}/departments/${idDepartment}/provinces`).pipe(map(res => res.data || res));
  }

  getDistricts(idProvince: string): Observable<any[]> {
    return this.http.get<any>(`${this.ubigeoUrl}/provinces/${idProvince}/districts`).pipe(map(res => res.data || res));
  }

  getRatesByUbigeo(ubigeoCode: string): Observable<any[]> {
    return this.http.get<any>(`${this.ubigeoUrl}/rates/${ubigeoCode}`).pipe(map(res => res.data || res));
  }
}
