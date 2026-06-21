import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LocationResponse {
  id: string;
  name: string;
}

export interface ShippingRateResponse {
  idShipmentMethod: string;
  methodName: string;
  finalCost: number;
  isAvailable: boolean;
  matchLevel: string;
}

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/ubigeo`;

  getDepartments(): Observable<LocationResponse[]> {
    return this.http.get<LocationResponse[]>(`${this.url}/departments`);
  }

  getProvinces(idDepartment: string): Observable<LocationResponse[]> {
    return this.http.get<LocationResponse[]>(`${this.url}/departments/${idDepartment}/provinces`);
  }

  getDistricts(idProvince: string): Observable<LocationResponse[]> {
    return this.http.get<LocationResponse[]>(`${this.url}/provinces/${idProvince}/districts`);
  }

  getRates(ubigeoCode: string): Observable<ShippingRateResponse[]> {
    return this.http.get<ShippingRateResponse[]>(`${this.url}/rates/${ubigeoCode}`);
  }
}
