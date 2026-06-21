import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ShipmentService } from '../../../../../core/services/shipment.service';
import { AlertService } from '../../../../../shared/services/alert.service';
import { ModalService } from '../../../../../shared/services/modal.service';
import { ShippingRate, ShipmentMethod, LocationResponse } from '../../../../../core/models/shipment.model';
import { CheckboxModule } from 'primeng/checkbox';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';

@Component({
  selector: 'app-rates-table',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonComponent, TagModule, DialogModule,
    ReactiveFormsModule, InputNumberModule, SelectModule,  CheckboxModule, CurrencyPenPipe
  ],
  templateUrl: './rates-table.html',
  styleUrl: './rates-table.css'
})
export class RatesTableComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);

  rates = signal<ShippingRate[]>([]);
  agencies = signal<ShipmentMethod[]>([]);
  departments = signal<LocationResponse[]>([]);
  provinces = signal<LocationResponse[]>([]);
  districts = signal<LocationResponse[]>([]);

  showDialog = signal(false);
  isEdit = signal(false);
  loading = signal(false);
  submitting = signal(false);

  form: FormGroup;
  currentRateId?: number;

  constructor() {
    this.form = this.fb.group({
      idShipmentMethod: ['', Validators.required],
      idDepartment: [null],
      idProvince: [{ value: null, disabled: true }],
      idDistrict: [{ value: null, disabled: true }],
      cost: [0, [Validators.required, Validators.min(0)]],
      isAvailable: [true]
    });

    this.form.get('idDepartment')?.valueChanges.subscribe(deptId => {
      if (deptId) {
        this.loadProvinces(deptId);
        this.form.get('idProvince')?.enable();
      } else {
        this.provinces.set([]);
        this.districts.set([]);
        this.form.patchValue({ idProvince: null, idDistrict: null });
        this.form.get('idProvince')?.disable();
        this.form.get('idDistrict')?.disable();
      }
    });

    this.form.get('idProvince')?.valueChanges.subscribe(provId => {
      if (provId) {
        this.loadDistricts(provId);
        this.form.get('idDistrict')?.enable();
      } else {
        this.districts.set([]);
        this.form.patchValue({ idDistrict: null });
        this.form.get('idDistrict')?.disable();
      }
    });
  }

  ngOnInit() {
    this.loadRates();
    this.loadAgencies();
    this.loadDepartments();
  }

  loadRates() {
    this.loading.set(true);
    this.shipmentService.getRates(0, 50).subscribe({
      next: (res) => {
        this.rates.set(res.content || []);
        this.loading.set(false);
      },
      error: () => {
        this.alertService.error('Error al cargar tarifas');
        this.loading.set(false);
      }
    });
  }

  loadAgencies() {
    this.shipmentService.getMethods(true).subscribe({
      next: (res) => this.agencies.set(res)
    });
  }

  loadDepartments() {
    this.shipmentService.getDepartments().subscribe({
      next: (res) => this.departments.set(res)
    });
  }

  loadProvinces(idDepartment: string) {
    this.shipmentService.getProvinces(idDepartment).subscribe({
      next: (res) => {
        this.provinces.set(res);
        this.form.patchValue({ idDistrict: null });
        this.districts.set([]);
      }
    });
  }

  loadDistricts(idProvince: string) {
    this.shipmentService.getDistricts(idProvince).subscribe({
      next: (res) => this.districts.set(res)
    });
  }

  getUbigeoDescription(rate: ShippingRate): string {
    const parts = [];
    if (rate.departmentName) parts.push(rate.departmentName);
    if (rate.provinceName) parts.push(rate.provinceName);
    if (rate.districtName) parts.push(rate.districtName);
    return parts.length > 0 ? parts.join(' / ') : 'Nacional (Todos)';
  }

  openCreate() {
    this.isEdit.set(false);
    this.currentRateId = undefined;
    this.form.reset({ cost: 0, isAvailable: true });
    this.form.get('idProvince')?.disable();
    this.form.get('idDistrict')?.disable();
    this.provinces.set([]);
    this.districts.set([]);
    this.showDialog.set(true);
  }

  openEdit(rate: ShippingRate) {
    this.isEdit.set(true);
    this.currentRateId = rate.idRate;
    
    if (rate.idDepartment) {
      this.loadProvinces(rate.idDepartment);
      this.form.get('idProvince')?.enable();
    } else {
      this.form.get('idProvince')?.disable();
    }
    
    if (rate.idProvince) {
      this.loadDistricts(rate.idProvince);
      this.form.get('idDistrict')?.enable();
    } else {
      this.form.get('idDistrict')?.disable();
    }

    this.form.patchValue({
      idShipmentMethod: rate.idShipmentMethod,
      idDepartment: rate.idDepartment || null,
      idProvince: rate.idProvince || null,
      idDistrict: rate.idDistrict || null,
      cost: rate.cost,
      isAvailable: rate.isAvailable
    });

    this.showDialog.set(true);
  }

  delete(rate: ShippingRate) {
    this.modalService.open({
      title: '¿Eliminar tarifa?',
      message: `¿Estás seguro de que deseas eliminar esta tarifa?`,
      severity: 'danger',
      confirmLabel: 'Sí, eliminar',
      onConfirm: () => {
        this.shipmentService.deleteRate(rate.idRate).subscribe({
          next: () => {
            this.alertService.success('Tarifa eliminada');
            this.loadRates();
          },
          error: () => this.alertService.error('Error al eliminar')
        });
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const data = this.form.value;

    const request = this.isEdit() 
      ? this.shipmentService.updateRate(this.currentRateId!, data)
      : this.shipmentService.createRate(data);

    request.subscribe({
      next: () => {
        this.alertService.success(`Tarifa ${this.isEdit() ? 'actualizada' : 'creada'}`);
        this.showDialog.set(false);
        this.loadRates();
        this.submitting.set(false);
      },
      error: () => {
        this.alertService.error('Error al guardar la tarifa');
        this.submitting.set(false);
      }
    });
  }
}
