import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { ShipmentService } from '../../../../../core/domains/shipping/services/shipment.service';
import { AlertService } from '../../../../../shared/services/alert.service';
import { ModalService } from '../../../../../shared/services/modal.service';
import { InputTextModule } from 'primeng/inputtext';
import { LocationPanelComponent, UbigeoItem } from '../location-panel/location-panel';
import { TranslationService } from '../../../../../core/services/translation.service';

@Component({
  selector: 'app-locations-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonComponent, InputTextModule, LocationPanelComponent],
  templateUrl: './locations-table.html',
  styleUrl: './locations-table.css',
})
export class LocationsTableComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);
  ts = inject(TranslationService);
  t = this.ts.t;

  departments = signal<UbigeoItem[]>([]);
  provinces = signal<UbigeoItem[]>([]);
  districts = signal<UbigeoItem[]>([]);

  selectedDepartment = signal<UbigeoItem | null>(null);
  selectedProvince = signal<UbigeoItem | null>(null);

  loadingDepts = signal(false);
  loadingProvs = signal(false);
  loadingDists = signal(false);

  showDialog = signal(false);
  dialogTitle = signal('');
  dialogLevel = signal<'department' | 'province' | 'district'>('department');
  submitting = signal(false);

  get content() {
    return {
      deptTitle: this.t().adminShipping.locations.deptTitle,
      provTitle: this.t().adminShipping.locations.provTitle,
      distTitle: this.t().adminShipping.locations.distTitle,
      deptEmpty: this.t().adminShipping.locations.deptEmpty,
      provEmpty: this.t().adminShipping.locations.provEmpty,
      distEmpty: this.t().adminShipping.locations.distEmpty,
      provPlaceholder: this.t().adminShipping.locations.provPlaceholder,
      distPlaceholder: this.t().adminShipping.locations.distPlaceholder
    };
  }

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^\\s*\\S.*$')]],
      name: ['', [Validators.required, Validators.pattern('^\\s*\\S.*$')]],
    });
  }

  ngOnInit() {
    this.loadDepartments();
  }


  loadDepartments() {
    this.loadingDepts.set(true);
    this.shipmentService.getDepartments().subscribe({
      next: (res) => {
        this.departments.set(res);
        this.loadingDepts.set(false);
      },
      error: () => {
        this.alertService.error(this.t().adminShipping.locations.alerts.loadDeptError);
        this.loadingDepts.set(false);
      },
    });
  }

  loadProvinces(dept: UbigeoItem) {
    this.selectedDepartment.set(dept);
    this.selectedProvince.set(null);
    this.districts.set([]);
    this.loadingProvs.set(true);
    this.shipmentService.getProvinces(dept.id).subscribe({
      next: (res) => {
        this.provinces.set(res);
        this.loadingProvs.set(false);
      },
      error: () => {
        this.alertService.error(this.t().adminShipping.locations.alerts.loadProvError);
        this.loadingProvs.set(false);
      },
    });
  }

  loadDistricts(prov: UbigeoItem) {
    this.selectedProvince.set(prov);
    this.loadingDists.set(true);
    this.shipmentService.getDistricts(prov.id).subscribe({
      next: (res) => {
        this.districts.set(res);
        this.loadingDists.set(false);
      },
      error: () => {
        this.alertService.error(this.t().adminShipping.locations.alerts.loadDistError);
        this.loadingDists.set(false);
      },
    });
  }


  openCreateDepartment() {
    this.dialogLevel.set('department');
    this.dialogTitle.set(this.t().adminShipping.locations.dialogs.department);
    this.form.reset();
    this.showDialog.set(true);
  }

  openCreateProvince() {
    this.dialogLevel.set('province');
    this.dialogTitle.set(this.t().adminShipping.locations.dialogs.province);
    this.form.reset();
    this.showDialog.set(true);
  }

  openCreateDistrict() {
    this.dialogLevel.set('district');
    this.dialogTitle.set(this.t().adminShipping.locations.dialogs.district);
    this.form.reset();
    this.showDialog.set(true);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const { id, name } = this.form.value;
    const level = this.dialogLevel();

    let request$;

    if (level === 'department') {
      request$ = this.shipmentService.createDepartment({ id, name });
    } else if (level === 'province') {
      request$ = this.shipmentService.createProvince(this.selectedDepartment()!.id, { id, name });
    } else {
      request$ = this.shipmentService.createDistrict(this.selectedProvince()!.id, { id, name });
    }

    request$.subscribe({
      next: () => {
        const labels: Record<string, string> = {
          department: this.t().adminShipping.locations.alerts.createDeptSuccess,
          province: this.t().adminShipping.locations.alerts.createProvSuccess,
          district: this.t().adminShipping.locations.alerts.createDistSuccess,
        };
        this.alertService.success(labels[level]);
        this.showDialog.set(false);
        this.submitting.set(false);
        this.refreshAfterChange(level);
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || this.t().adminShipping.locations.alerts.createError;
        this.alertService.error(errMsg);
        this.submitting.set(false);
      },
    });
  }


  deleteDepartment(dept: UbigeoItem) {
    this.modalService.open({
      title: this.t().adminShipping.locations.confirmDelete.departmentTitle,
      message: this.t().adminShipping.locations.confirmDelete.departmentMsg.replace('{name}', dept.name),
      severity: 'danger',
      confirmLabel: this.t().adminShipping.locations.confirmDelete.confirmLabel,
      onConfirm: () => {
        this.shipmentService.deleteDepartment(dept.id).subscribe({
          next: () => {
            this.alertService.success(this.t().adminShipping.locations.alerts.deleteDeptSuccess);
            if (this.selectedDepartment()?.id === dept.id) {
              this.selectedDepartment.set(null);
              this.provinces.set([]);
              this.selectedProvince.set(null);
              this.districts.set([]);
            }
            this.loadDepartments();
          },
          error: (err: any) => {
            const errMsg = err?.error?.message || this.t().adminShipping.locations.alerts.deleteDeptError;
            this.alertService.error(errMsg);
          },
        });
      },
    });
  }

  deleteProvince(prov: UbigeoItem) {
    this.modalService.open({
      title: this.t().adminShipping.locations.confirmDelete.provinceTitle,
      message: this.t().adminShipping.locations.confirmDelete.provinceMsg.replace('{name}', prov.name),
      severity: 'danger',
      confirmLabel: this.t().adminShipping.locations.confirmDelete.confirmLabel,
      onConfirm: () => {
        this.shipmentService.deleteProvince(prov.id).subscribe({
          next: () => {
            this.alertService.success(this.t().adminShipping.locations.alerts.deleteProvSuccess);
            if (this.selectedProvince()?.id === prov.id) {
              this.selectedProvince.set(null);
              this.districts.set([]);
            }
            this.loadProvinces(this.selectedDepartment()!);
          },
          error: (err: any) => {
            const errMsg = err?.error?.message || this.t().adminShipping.locations.alerts.deleteProvError;
            this.alertService.error(errMsg);
          },
        });
      },
    });
  }

  deleteDistrict(dist: UbigeoItem) {
    this.modalService.open({
      title: this.t().adminShipping.locations.confirmDelete.districtTitle,
      message: this.t().adminShipping.locations.confirmDelete.districtMsg.replace('{name}', dist.name),
      severity: 'danger',
      confirmLabel: this.t().adminShipping.locations.confirmDelete.confirmLabel,
      onConfirm: () => {
        this.shipmentService.deleteDistrict(dist.id).subscribe({
          next: () => {
            this.alertService.success(this.t().adminShipping.locations.alerts.deleteDistSuccess);
            this.loadDistricts(this.selectedProvince()!);
          },
          error: (err: any) => {
            const errMsg = err?.error?.message || this.t().adminShipping.locations.alerts.deleteDistError;
            this.alertService.error(errMsg);
          },
        });
      },
    });
  }


  private refreshAfterChange(level: string) {
    if (level === 'department') {
      this.loadDepartments();
    } else if (level === 'province') {
      this.loadProvinces(this.selectedDepartment()!);
    } else {
      this.loadDistricts(this.selectedProvince()!);
    }
  }

  getCodeHint(): string {
    const level = this.dialogLevel();
    if (level === 'department') return this.t().adminShipping.locations.hints.department;
    if (level === 'province') return this.t().adminShipping.locations.hints.province;
    return this.t().adminShipping.locations.hints.district;
  }

  getCodeMaxLength(): number {
    const level = this.dialogLevel();
    if (level === 'department') return 2;
    if (level === 'province') return 4;
    return 6;
  }
}
