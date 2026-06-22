import { Component, Input, Output, EventEmitter, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { ShipmentService } from '../../../../../core/services/shipment.service';
import { AlertService } from '../../../../../shared/services/alert.service';
import { LocationResponse } from '../../../../../core/models/shipment.model';
import { DestinationChip } from '../rates-table/rates-table';

@Component({
  selector: 'app-destination-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectModule, SelectModule, InputTextModule, ButtonComponent],
  templateUrl: './destination-picker.html',
  styleUrl: './destination-picker.css'
})
export class DestinationPickerComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private alertService = inject(AlertService);

  @Input() destinations: DestinationChip[] = [];
  @Output() destinationsChange = new EventEmitter<DestinationChip[]>();

  departments = signal<LocationResponse[]>([]);
  provinces = signal<LocationResponse[]>([]);
  districts = signal<LocationResponse[]>([]);

  pickerDepartment = signal<string | null>(null);
  pickerProvinces = signal<string[]>([]);
  pickerDistricts = signal<string[]>([]);
  pickerAddress = signal<string>('');

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.shipmentService.getDepartments().subscribe({
      next: (res: any[]) => this.departments.set(res)
    });
  }

  loadProvinces(idDepartment: string) {
    this.shipmentService.getProvinces(idDepartment).subscribe({
      next: (res: any[]) => {
        this.provinces.set(res);
        this.districts.set([]);
      }
    });
  }

  loadDistricts(idProvince: string) {
    this.shipmentService.getDistricts(idProvince).subscribe({
      next: (res: any[]) => this.districts.set(res)
    });
  }

  onPickerDepartmentChange(deptId: string | null) {
    this.pickerDepartment.set(deptId);
    this.pickerProvinces.set([]);
    this.pickerDistricts.set([]);
    this.districts.set([]);
    if (deptId) {
      this.loadProvinces(deptId);
    } else {
      this.provinces.set([]);
    }
  }

  onPickerProvincesChange(provIds: string[]) {
    this.pickerProvinces.set(provIds);
    this.pickerDistricts.set([]);
    if (provIds && provIds.length === 1) {
      this.loadDistricts(provIds[0]);
    } else {
      this.districts.set([]);
    }
  }

  onPickerDistrictsChange(distIds: string[]) {
    this.pickerDistricts.set(distIds);
  }

  addDestination() {
    const deptId = this.pickerDepartment();
    const provIds = this.pickerProvinces();
    const distIds = this.pickerDistricts();
    const address = this.pickerAddress().trim();

    if (!deptId && provIds.length === 0 && distIds.length === 0) {
      this.alertService.warn('Seleccione al menos un nivel de ubicación');
      return;
    }

    const dept = deptId ? this.departments().find(d => d.id === deptId) : null;
    let chipsToAdd: DestinationChip[] = [];

    if (distIds.length > 0) {
      const provId = provIds[0];
      const prov = this.provinces().find(p => p.id === provId);
      for (const distId of distIds) {
        const dist = this.districts().find(d => d.id === distId);
        if (dept && prov && dist) {
          chipsToAdd.push({
            id: Math.random().toString(36).substring(2, 9),
            idDepartment: deptId!,
            idProvince: provId,
            idDistrict: distId,
            label: address ? `${dept.name} / ${prov.name} / ${dist.name} (Dirección: ${address})` : `${dept.name} / ${prov.name} / ${dist.name}`,
            agencyAddress: address || undefined
          });
        }
      }
    } else if (provIds.length > 0) {
      for (const provId of provIds) {
        const prov = this.provinces().find(p => p.id === provId);
        if (dept && prov) {
          chipsToAdd.push({
            id: Math.random().toString(36).substring(2, 9),
            idDepartment: deptId!,
            idProvince: provId,
            idDistrict: undefined,
            label: address ? `${dept.name} / ${prov.name} (Dirección: ${address})` : `${dept.name} / ${prov.name}`,
            agencyAddress: address || undefined
          });
        }
      }
    } else if (deptId && dept) {
      chipsToAdd.push({
        id: Math.random().toString(36).substring(2, 9),
        idDepartment: deptId,
        idProvince: undefined,
        idDistrict: undefined,
        label: address ? `${dept.name} (Dirección: ${address})` : `${dept.name}`,
        agencyAddress: address || undefined
      });
    }

    const existing = [...this.destinations];
    let addedCount = 0;

    for (const chip of chipsToAdd) {
      const isDuplicate = existing.some(d =>
        d.idDepartment === chip.idDepartment &&
        d.idProvince === chip.idProvince &&
        d.idDistrict === chip.idDistrict
      );
      if (!isDuplicate) {
        existing.push(chip);
        addedCount++;
      }
    }

    if (addedCount === 0 && chipsToAdd.length > 0) {
      this.alertService.warn('Los destinos seleccionados ya fueron agregados');
      return;
    }

    this.destinationsChange.emit(existing);

    this.pickerDepartment.set(null);
    this.pickerProvinces.set([]);
    this.pickerDistricts.set([]);
    this.pickerAddress.set('');
    this.provinces.set([]);
    this.districts.set([]);
  }

  removeDestination(index: number) {
    const current = [...this.destinations];
    current.splice(index, 1);
    this.destinationsChange.emit(current);
  }
}
