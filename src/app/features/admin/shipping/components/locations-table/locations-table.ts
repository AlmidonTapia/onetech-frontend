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

  content = {
    deptTitle: 'Departamentos',
    provTitle: 'Provincias',
    distTitle: 'Distritos',
    deptEmpty: 'No hay departamentos',
    provEmpty: 'No hay provincias',
    distEmpty: 'No hay distritos',
    provPlaceholder: 'Seleccione un departamento',
    distPlaceholder: 'Seleccione una provincia'
  };

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
        this.alertService.error('Error al cargar departamentos');
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
        this.alertService.error('Error al cargar provincias');
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
        this.alertService.error('Error al cargar distritos');
        this.loadingDists.set(false);
      },
    });
  }


  openCreateDepartment() {
    this.dialogLevel.set('department');
    this.dialogTitle.set('Nuevo Departamento');
    this.form.reset();
    this.showDialog.set(true);
  }

  openCreateProvince() {
    this.dialogLevel.set('province');
    this.dialogTitle.set('Nueva Provincia');
    this.form.reset();
    this.showDialog.set(true);
  }

  openCreateDistrict() {
    this.dialogLevel.set('district');
    this.dialogTitle.set('Nuevo Distrito');
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
          department: 'Departamento creado',
          province: 'Provincia creada',
          district: 'Distrito creado',
        };
        this.alertService.success(labels[level]);
        this.showDialog.set(false);
        this.submitting.set(false);
        this.refreshAfterChange(level);
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || 'Error al crear. Verifique que el código no esté duplicado.';
        this.alertService.error(errMsg);
        this.submitting.set(false);
      },
    });
  }


  deleteDepartment(dept: UbigeoItem) {
    this.modalService.open({
      title: '¿Eliminar departamento?',
      message: `Se eliminará "${dept.name}" y todas sus provincias y distritos asociados.`,
      severity: 'danger',
      confirmLabel: 'Sí, eliminar',
      onConfirm: () => {
        this.shipmentService.deleteDepartment(dept.id).subscribe({
          next: () => {
            this.alertService.success('Departamento eliminado');
            if (this.selectedDepartment()?.id === dept.id) {
              this.selectedDepartment.set(null);
              this.provinces.set([]);
              this.selectedProvince.set(null);
              this.districts.set([]);
            }
            this.loadDepartments();
          },
          error: (err: any) => {
            const errMsg = err?.error?.message || 'Error al eliminar departamento';
            this.alertService.error(errMsg);
          },
        });
      },
    });
  }

  deleteProvince(prov: UbigeoItem) {
    this.modalService.open({
      title: '¿Eliminar provincia?',
      message: `Se eliminará "${prov.name}" y todos sus distritos asociados.`,
      severity: 'danger',
      confirmLabel: 'Sí, eliminar',
      onConfirm: () => {
        this.shipmentService.deleteProvince(prov.id).subscribe({
          next: () => {
            this.alertService.success('Provincia eliminada');
            if (this.selectedProvince()?.id === prov.id) {
              this.selectedProvince.set(null);
              this.districts.set([]);
            }
            this.loadProvinces(this.selectedDepartment()!);
          },
          error: (err: any) => {
            const errMsg = err?.error?.message || 'Error al eliminar provincia';
            this.alertService.error(errMsg);
          },
        });
      },
    });
  }

  deleteDistrict(dist: UbigeoItem) {
    this.modalService.open({
      title: '¿Eliminar distrito?',
      message: `Se eliminará "${dist.name}" de forma permanente.`,
      severity: 'danger',
      confirmLabel: 'Sí, eliminar',
      onConfirm: () => {
        this.shipmentService.deleteDistrict(dist.id).subscribe({
          next: () => {
            this.alertService.success('Distrito eliminado');
            this.loadDistricts(this.selectedProvince()!);
          },
          error: (err: any) => {
            const errMsg = err?.error?.message || 'Error al eliminar distrito';
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
    if (level === 'department') return 'Código de 2 dígitos (ej: 15)';
    if (level === 'province') return 'Código de 4 dígitos (ej: 1501)';
    return 'Código de 6 dígitos (ej: 150101)';
  }

  getCodeMaxLength(): number {
    const level = this.dialogLevel();
    if (level === 'department') return 2;
    if (level === 'province') return 4;
    return 6;
  }
}
