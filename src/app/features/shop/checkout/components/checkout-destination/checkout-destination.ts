import { Component, EventEmitter, OnInit, Output, signal, inject, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { LocationResponse } from '../../../../../core/domains/shipping/models/shipment.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SelectModule } from 'primeng/select';

export interface LocationSelection {
  code: string;
  label: string;
}

@Component({
  selector: 'app-checkout-destination',
  standalone: true,
  imports: [FormsModule, SelectModule],
  templateUrl: './checkout-destination.html'
})
export class CheckoutDestinationComponent implements OnInit {
  @Output() selected = new EventEmitter<LocationSelection | null>();

  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  departments = signal<LocationResponse[]>([]);
  provinces = signal<LocationResponse[]>([]);
  districts = signal<LocationResponse[]>([]);

  selectedDepartment = signal<string>('');
  selectedProvince = signal<string>('');
  selectedDistrict = signal<string>('');

  loadingDepts = signal(true);
  loadingProvs = signal(false);
  loadingDists = signal(false);
  content = {
    title: 'Selecciona tu Destino',
    deptLabel: 'Departamento / Región',
    provLabel: 'Provincia',
    distLabel: 'Distrito'
  };

  ngOnInit() {
    this.fetchDepartments();
  }

  fetchDepartments() {
    this.loadingDepts.set(true);
    this.http.get<any>(`${environment.apiUrl}/ubigeo/departments`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.departments.set(res || []);
        this.loadingDepts.set(false);
      },
      error: () => this.loadingDepts.set(false)
    });
  }

  onDepartmentChange(deptId: string) {
    this.selectedDepartment.set(deptId);
    this.selectedProvince.set('');
    this.selectedDistrict.set('');
    this.provinces.set([]);
    this.districts.set([]);
    this.selected.emit(null);
    
    if (deptId) {
      this.loadingProvs.set(true);
      this.http.get<any>(`${environment.apiUrl}/ubigeo/departments/${deptId}/provinces`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.provinces.set(res || []);
          this.loadingProvs.set(false);
        },
        error: () => this.loadingProvs.set(false)
      });
    }
  }

  onProvinceChange(provId: string) {
    this.selectedProvince.set(provId);
    this.selectedDistrict.set('');
    this.districts.set([]);
    this.selected.emit(null);
    
    if (provId) {
      this.loadingDists.set(true);
      this.http.get<any>(`${environment.apiUrl}/ubigeo/provinces/${provId}/districts`).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.districts.set(res || []);
          this.loadingDists.set(false);
        },
        error: () => this.loadingDists.set(false)
      });
    }
  }

  onDistrictChange(distId: string) {
    this.selectedDistrict.set(distId);
    if (distId) {
      const deptName = this.departments().find(d => d.id === this.selectedDepartment())?.name || '';
      const provName = this.provinces().find(p => p.id === this.selectedProvince())?.name || '';
      const distName = this.districts().find(d => d.id === distId)?.name || '';
      
      this.selected.emit({
        code: distId,
        label: `${deptName}/${provName}/${distName}`
      });
    } else {
      this.selected.emit(null);
    }
  }
}
