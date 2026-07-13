import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

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
    return this.http.get<any>(`${this.url}/departments`).pipe(map(res => res.data || res));
  }

  getProvinces(idDepartment: string): Observable<LocationResponse[]> {
    return this.http.get<any>(`${this.url}/departments/${idDepartment}/provinces`).pipe(map(res => res.data || res));
  }

  getDistricts(idProvince: string): Observable<LocationResponse[]> {
    return this.http.get<any>(`${this.url}/provinces/${idProvince}/districts`).pipe(map(res => res.data || res));
  }

  getRates(ubigeoCode: string): Observable<ShippingRateResponse[]> {
    return this.http.get<any>(`${this.url}/rates/${ubigeoCode}`).pipe(map(res => res.data || res));
  }
}
