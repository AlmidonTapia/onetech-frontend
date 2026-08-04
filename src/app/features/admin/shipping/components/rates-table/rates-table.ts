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
import { adminShippingContent } from '../../../../../core/content/shared/adminShipping.content';

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
  templateUrl: './rates-table.html'
})
export class RatesTableComponent implements OnInit {
  adminShippingContent = adminShippingContent;

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

  get content() {
    return {
      title: adminShippingContent.rates.title,
      newRateBtn: adminShippingContent.rates.newRateBtn,
      createBtnLabel: adminShippingContent.rates.newRateBtn,
      createBtnIcon: 'pi pi-plus',
      quickSearch: adminShippingContent.rates.quickSearch,
      searchPlaceholder: adminShippingContent.rates.searchPlaceholder,
      emptyTable: adminShippingContent.rates.emptyTable,
      createDialogTitle: adminShippingContent.rates.modal.createTitle,
      editDialogTitle: adminShippingContent.rates.modal.editTitle,
      columns: {
        agency: adminShippingContent.rates.columns.agency,
        destination: adminShippingContent.rates.columns.destination,
        address: adminShippingContent.rates.columns.address,
        cost: adminShippingContent.rates.columns.cost,
        status: adminShippingContent.rates.columns.status,
        actions: adminShippingContent.rates.columns.actions
      },
      modal: {
        createTitle: adminShippingContent.rates.modal.createTitle,
        editTitle: adminShippingContent.rates.modal.editTitle,
        cancelBtn: adminShippingContent.rates.modal.cancelBtn,
        saveBtn: adminShippingContent.rates.modal.saveBtn
      },
      filter: {
        agencyPlaceholder: adminShippingContent.rates.filter.agencyPlaceholder,
        deptPlaceholder: adminShippingContent.rates.filter.deptPlaceholder,
        provPlaceholder: adminShippingContent.rates.filter.provPlaceholder
      },
      form: {
        agencyLabel: adminShippingContent.rates.form.agencyLabel,
        departmentLabel: adminShippingContent.rates.form.departmentLabel,
        provinceLabel: adminShippingContent.rates.form.provinceLabel,
        districtLabel: adminShippingContent.rates.form.districtLabel,
        addressLabel: adminShippingContent.rates.form.addressLabel,
        costLabel: adminShippingContent.rates.form.costLabel,
        availableLabel: adminShippingContent.rates.form.availableLabel,
        agencyPlaceholder: adminShippingContent.rates.form.agencyPlaceholder,
        addressPlaceholder: adminShippingContent.rates.form.addressPlaceholder
      }
    };
  }

  get availabilityFilterOptions() {
    return [
      { label: adminShippingContent.rates.filters.allStatuses, value: 'ALL' },
      { label: adminShippingContent.rates.filters.available, value: 'AVAILABLE' },
      { label: adminShippingContent.rates.filters.unavailable, value: 'UNAVAILABLE' }
    ];
  }

  agencyFilterOptions = computed(() => {
    return [
      { label: adminShippingContent.rates.filters.allAgencies, value: 'ALL' },
      ...this.agencies().map(a => ({ label: a.methodName, value: a.idShipmentMethod }))
    ];
  });

  departmentFilterOptions = computed(() => {
    return [
      { label: adminShippingContent.rates.filters.allDepartments, value: 'ALL' },
      ...this.filterDepartments().map(d => ({ label: d.name, value: d.id }))
    ];
  });

  provinceFilterOptions = computed(() => {
    return [
      { label: adminShippingContent.rates.filters.allProvinces, value: 'ALL' },
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
      this.shipmentService.getProvinces(deptId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
    this.shipmentService.getRates(0, 500).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.rates.set(res.content || []);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || adminShippingContent.rates.alerts.loadError);
        this.loading.set(false);
      }
    });
  }

  loadAgencies() {
    this.shipmentService.getMethods(true).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => this.agencies.set(res)
    });
  }

  loadFilterDepartments() {
    this.shipmentService.getDepartments().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => this.filterDepartments.set(res)
    });
  }

  loadDepartments() {
    this.shipmentService.getDepartments().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => this.departments.set(res)
    });
  }

  loadProvinces(idDepartment: string) {
    this.shipmentService.getProvinces(idDepartment).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.provinces.set(res);
        this.form.patchValue({ idDistrict: null });
        this.districts.set([]);
      }
    });
  }

  loadDistricts(idProvince: string) {
    this.shipmentService.getDistricts(idProvince).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => this.districts.set(res)
    });
  }

  getUbigeoDescription(rate: ShippingRate): string {
    const parts = [];
    if (rate.departmentName) parts.push(rate.departmentName);
    if (rate.provinceName) parts.push(rate.provinceName);
    if (rate.districtName) parts.push(rate.districtName);
    return parts.length > 0 ? parts.join(' / ') : adminShippingContent.rates.values.national;
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
      title: adminShippingContent.rates.confirmDelete.title,
      message: adminShippingContent.rates.confirmDelete.message.replace('{agency}', rate.methodName || ''),
      severity: 'danger',
      confirmLabel: adminShippingContent.rates.confirmDelete.confirmLabel,
      onConfirm: () => {
        this.shipmentService.deleteRate(rate.idRate).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => {
            this.alertService.success(adminShippingContent.rates.alerts.deleteSuccess);
            this.loadRates();
          },
          error: (err: any) => {
            const errMsg = err?.error?.message || adminShippingContent.rates.alerts.deleteError;
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
      this.alertService.warn(adminShippingContent.rates.alerts.requireDestination);
      return;
    }

    this.submitting.set(true);
    const data = this.form.value;

    if (this.isEdit()) {
      this.shipmentService.updateRate(this.currentRateId!, data).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.alertService.success(adminShippingContent.rates.alerts.saveSuccess);
          this.showDialog.set(false);
          this.loadRates();
          this.submitting.set(false);
        },
        error: (err: any) => {
          const errMsg = err?.error?.message || adminShippingContent.rates.alerts.saveError;
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

      forkJoin(requests).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.alertService.success(adminShippingContent.rates.alerts.createSuccess.replace('{count}', requests.length.toString()));
          this.showDialog.set(false);
          this.loadRates();
          this.submitting.set(false);
        },
        error: (err: any) => {
          const errMsg = err?.error?.message || adminShippingContent.rates.alerts.createError;
          this.alertService.error(errMsg);
          this.submitting.set(false);
          this.loadRates();
        }
      });
    }
  }
}
