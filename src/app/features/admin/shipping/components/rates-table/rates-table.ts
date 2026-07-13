import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ShipmentService } from '../../../../../core/domains/shipping/services/shipment.service';
import { AlertService } from '../../../../../shared/services/alert.service';
import { ModalService } from '../../../../../shared/services/modal.service';
import { ShippingRate, ShipmentMethod, LocationResponse } from '../../../../../core/domains/shipping/models/shipment.model';
import { CheckboxModule } from 'primeng/checkbox';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestinationPickerComponent } from '../destination-picker/destination-picker';

import { FormsModule } from '@angular/forms';

export interface DestinationChip {
  id: string;
  label: string;
  idDepartment: string;
  idProvince?: string;
  idDistrict?: string;
  agencyAddress?: string;
}

@Component({
  selector: 'app-rates-table',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonComponent, TagModule, DialogModule,
    ReactiveFormsModule, InputNumberModule, SelectModule,  CheckboxModule, CurrencyPenPipe, DestinationPickerComponent
  ],
  templateUrl: './rates-table.html',
  styleUrl: './rates-table.css'
})
export class RatesTableComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  rates = signal<ShippingRate[]>([]);
  agencies = signal<ShipmentMethod[]>([]);
  
  filterDepartments = signal<LocationResponse[]>([]);
  filterProvinces = signal<LocationResponse[]>([]);
  
  filterAgency = signal<string>('ALL');
  filterDepartment = signal<string>('ALL');
  filterProvince = signal<string>('ALL');
  filterAvailability = signal<string>('ALL');
  filterText = signal<string>('');

  departments = signal<LocationResponse[]>([]);
  provinces = signal<LocationResponse[]>([]);
  districts = signal<LocationResponse[]>([]);

  showDialog = signal(false);
  isEdit = signal(false);
  loading = signal(false);
  submitting = signal(false);

  form: FormGroup;
  currentRateId?: number;

  destinations = signal<DestinationChip[]>([]);

  content = {
    title: 'Tarifas de Envío',
    newRateBtn: 'Nueva Tarifa',
    createBtnLabel: 'Nueva Tarifa',
    createBtnIcon: 'pi pi-plus',
    quickSearch: 'Búsqueda rápida',
    searchPlaceholder: 'Buscar agencia o ubigeo...',
    emptyTable: 'No se encontraron tarifas que coincidan con los filtros aplicados.',
    createDialogTitle: 'Configurar Nueva Tarifa',
    editDialogTitle: 'Editar Tarifa Existente',
    columns: {
      agency: 'Agencia / Carrier',
      destination: 'Destino (Ubigeo)',
      address: 'Dirección',
      cost: 'Costo Adicional',
      status: 'Estado',
      actions: 'Acciones'
    },
    modal: {
      createTitle: 'Configurar Nueva Tarifa',
      editTitle: 'Editar Tarifa Existente',
      cancelBtn: 'Cancelar',
      saveBtn: 'Guardar Tarifa'
    },
    filter: {
      agencyPlaceholder: 'Todas las Agencias',
      deptPlaceholder: 'Todos los Deptos.',
      provPlaceholder: 'Todas las Provincias'
    },
    form: {
      agencyLabel: 'Agencia de Envío *',
      departmentLabel: 'Departamento (Opcional)',
      provinceLabel: 'Provincia (Opcional)',
      districtLabel: 'Distrito (Opcional)',
      addressLabel: 'Dirección del Local (Opcional)',
      costLabel: 'Costo Adicional *',
      availableLabel: 'Disponible',
      agencyPlaceholder: 'Seleccione una agencia',
      addressPlaceholder: 'Ej: Av. Principal 123'
    }
  };

  availabilityFilterOptions = [
    { label: 'Todos los estados', value: 'ALL' },
    { label: 'Disponible', value: 'AVAILABLE' },
    { label: 'No Disponible', value: 'UNAVAILABLE' }
  ];

  agencyFilterOptions = computed(() => {
    return [
      { label: 'Todas las Agencias', value: 'ALL' },
      ...this.agencies().map(a => ({ label: a.methodName, value: a.idShipmentMethod }))
    ];
  });

  departmentFilterOptions = computed(() => {
    return [
      { label: 'Todos los Departamentos', value: 'ALL' },
      ...this.filterDepartments().map(d => ({ label: d.name, value: d.id }))
    ];
  });

  provinceFilterOptions = computed(() => {
    return [
      { label: 'Todas las Provincias', value: 'ALL' },
      ...this.filterProvinces().map(p => ({ label: p.name, value: p.id }))
    ];
  });

  filteredRates = computed(() => {
    return this.rates().filter(r => {
      const matchAgency = this.filterAgency() === 'ALL' || r.idShipmentMethod === this.filterAgency();
      const matchDept = this.filterDepartment() === 'ALL' || r.idDepartment === this.filterDepartment();
      const matchProv = this.filterProvince() === 'ALL' || r.idProvince === this.filterProvince();
      const matchAvailability = this.filterAvailability() === 'ALL' || 
          (this.filterAvailability() === 'AVAILABLE' ? r.isAvailable : !r.isAvailable);
      const text = this.filterText().toLowerCase().trim();
      const matchText = !text || 
          (r.methodName?.toLowerCase().includes(text) || 
           this.getUbigeoDescription(r).toLowerCase().includes(text));

      return matchAgency && matchDept && matchProv && matchAvailability && matchText;
    });
  });

  constructor() {
    this.form = this.fb.group({
      idShipmentMethod: ['', Validators.required],
      idDepartment: [null],
      idProvince: [{ value: null, disabled: true }],
      idDistrict: [{ value: null, disabled: true }],
      cost: [0, [Validators.required, Validators.min(0)]],
      isAvailable: [true],
      agencyAddress: ['']
    });

    this.form.get('idDepartment')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(deptId => {
      if (this.isEdit()) {
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
      }
    });

    this.form.get('idProvince')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(provId => {
      if (this.isEdit()) {
        if (provId) {
          this.loadDistricts(provId);
          this.form.get('idDistrict')?.enable();
        } else {
          this.districts.set([]);
          this.form.patchValue({ idDistrict: null });
          this.form.get('idDistrict')?.disable();
        }
      }
    });
  }

  onFilterDepartmentChange(deptId: string) {
    this.filterDepartment.set(deptId);
    this.filterProvince.set('ALL');
    if (deptId && deptId !== 'ALL') {
      this.shipmentService.getProvinces(deptId).subscribe({
        next: (res) => this.filterProvinces.set(res),
        error: () => this.filterProvinces.set([])
      });
    } else {
      this.filterProvinces.set([]);
    }
  }

  ngOnInit() {
    this.loadRates();
    this.loadAgencies();
    this.loadFilterDepartments();
  }

  loadRates() {
    this.loading.set(true);
    this.shipmentService.getRates(0, 500).subscribe({
      next: (res) => {
        this.rates.set(res.content || []);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || 'Error al cargar tarifas');
        this.loading.set(false);
      }
    });
  }

  loadAgencies() {
    this.shipmentService.getMethods(true).subscribe({
      next: (res) => this.agencies.set(res)
    });
  }

  loadFilterDepartments() {
    this.shipmentService.getDepartments().subscribe({
      next: (res) => this.filterDepartments.set(res)
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
    this.destinations.set([]);
    this.form.reset({ cost: 0, isAvailable: true, agencyAddress: '' });
    this.showDialog.set(true);
  }

  openEdit(rate: ShippingRate) {
    this.isEdit.set(true);
    this.currentRateId = rate.idRate;
    
    this.loadDepartments();
    
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
      isAvailable: rate.isAvailable,
      agencyAddress: rate.agencyAddress || ''
    });

    this.showDialog.set(true);
  }

  delete(rate: ShippingRate) {
    this.modalService.open({
      title: '¿Eliminar tarifa?',
      message: `¿Estás seguro de que deseas eliminar esta tarifa de ${rate.methodName}?`,
      severity: 'danger',
      confirmLabel: 'Sí, eliminar',
      onConfirm: () => {
        this.shipmentService.deleteRate(rate.idRate).subscribe({
          next: () => {
            this.alertService.success('Tarifa eliminada');
            this.loadRates();
          },
          error: (err: any) => {
            const errMsg = err?.error?.message || 'Error al eliminar';
            this.alertService.error(errMsg);
          }
        });
      }
    });
  }

  onDestinationsChange(chips: DestinationChip[]) {
    this.destinations.set(chips);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    if (!this.isEdit() && this.destinations().length === 0) {
      this.alertService.warn('Añade al menos un destino para la tarifa.');
      return;
    }

    this.submitting.set(true);
    const data = this.form.value;

    if (this.isEdit()) {
      this.shipmentService.updateRate(this.currentRateId!, data).subscribe({
        next: () => {
          this.alertService.success('Tarifa actualizada');
          this.showDialog.set(false);
          this.loadRates();
          this.submitting.set(false);
        },
        error: (err: any) => {
          const errMsg = err?.error?.message || 'Error al actualizar la tarifa';
          this.alertService.error(errMsg);
          this.submitting.set(false);
        }
      });
    } else {
      const requests = this.destinations().map(dest => {
        const rateData = {
          ...data,
          idDepartment: dest.idDepartment,
          idProvince: dest.idProvince || null,
          idDistrict: dest.idDistrict || null
        };
        return this.shipmentService.createRate(rateData);
      });

      forkJoin(requests).subscribe({
        next: () => {
          this.alertService.success(`${requests.length} tarifa(s) creada(s) correctamente`);
          this.showDialog.set(false);
          this.loadRates();
          this.submitting.set(false);
        },
        error: (err: any) => {
          const errMsg = err?.error?.message || 'Hubo un error al crear algunas tarifas';
          this.alertService.error(errMsg);
          this.submitting.set(false);
          this.loadRates();
        }
      });
    }
  }
}
