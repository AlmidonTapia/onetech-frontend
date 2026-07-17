import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { AlertService } from '../../../../../shared/services/alert.service';
import { ModalService } from '../../../../../shared/services/modal.service';
import { ShipmentService } from '../../../../../core/domains/shipping/services/shipment.service';
import { ShipmentMethod } from '../../../../../core/domains/shipping/models/shipment.model';
import { ShipmentsMethodTableComponent } from './components/shipments-method-table/shipments-method-table';
import { ShipmentMethodFormComponent } from './components/shipment-method-form/shipment-method-form';
import { TranslationService } from '../../../../../core/services/translation.service';

@Component({
  selector: 'app-agencies-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent,  ShipmentsMethodTableComponent, ShipmentMethodFormComponent],
  templateUrl: './agencies-table.html',
  styleUrl: './agencies-table.css'
})
export class AgenciesTableComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);
  ts = inject(TranslationService);
  t = this.ts.t;

  methods = signal<ShipmentMethod[]>([]);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingMethod = signal<ShipmentMethod | null>(null);
  searchTerm = signal<string | undefined>(undefined);

  get statuses() {
    return [
      { label: this.t().adminShipping.agencies.statuses.active, value: 'ACTIVO' },
      { label: this.t().adminShipping.agencies.statuses.inactive, value: 'INACTIVO' }
    ];
  }

  get content() {
    return {
      title: this.t().adminShipping.agencies.title,
      badgeSuffix: this.t().adminShipping.agencies.badgeSuffix,
      newBtnLabel: this.t().adminShipping.agencies.newBtnLabel,
      newBtnIcon: 'pi-plus',
      table: {
        quickSearchTitle: this.t().adminShipping.agencies.table.quickSearchTitle,
        searchPlaceholder: this.t().adminShipping.agencies.table.searchPlaceholder,
        headers: {
          name: this.t().adminShipping.agencies.table.headers.name,
          price: this.t().adminShipping.agencies.table.headers.price,
          status: this.t().adminShipping.agencies.table.headers.status,
          actions: this.t().adminShipping.agencies.table.headers.actions
        },
        emptyMsg: this.t().adminShipping.agencies.table.emptyMsg
      },
      dialog: {
        createTitle: this.t().adminShipping.agencies.dialog.createTitle,
        editTitle: this.t().adminShipping.agencies.dialog.editTitle,
        fields: {
          name: this.t().adminShipping.agencies.dialog.fields.name,
          namePlaceholder: this.t().adminShipping.agencies.dialog.fields.namePlaceholder,
          price: this.t().adminShipping.agencies.dialog.fields.price,
          status: this.t().adminShipping.agencies.dialog.fields.status,
          statusPlaceholder: this.t().adminShipping.agencies.dialog.fields.statusPlaceholder
        },
        actions: {
          cancel: this.t().adminShipping.agencies.dialog.actions.cancel,
          save: this.t().adminShipping.agencies.dialog.actions.save
        }
      }
    };
  }

  form = this.fb.group({
    methodName: ['', Validators.required],
    basePrice: [0, [Validators.required, Validators.min(0)]],
    status: ['ACTIVO']
  });

  ngOnInit() {
    this.loadMethods();
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.loadMethods();
  }

  loadMethods() {
    this.loading.set(true);
    this.shipmentService.getMethods(false, this.searchTerm()).subscribe({
      next: r => {
        this.methods.set(r);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate() {
    this.editingMethod.set(null);
    this.form.reset({ methodName: '', basePrice: 0, status: 'ACTIVO' });
    this.formVisible.set(true);
  }

  openEdit(m: ShipmentMethod) {
    this.editingMethod.set(m);
    this.form.reset({
      methodName: m.methodName,
      basePrice: m.basePrice,
      status: m.status || 'ACTIVO'
    });
    this.formVisible.set(true);
  }

  onSave() {
    if (this.form.invalid) return;
    this.saving.set(true);
    
    const formVal = this.form.value;
    const data: any = {
      methodName: formVal.methodName!,
      basePrice: formVal.basePrice!,
      status: formVal.status || 'ACTIVO'
    };

    const currentMethod = this.editingMethod();
    const req$ = currentMethod
      ? this.shipmentService.updateMethod(currentMethod.idShipmentMethod, data)
      : this.shipmentService.createMethod(data);

    req$.subscribe({
      next: () => {
        this.alertService.success(this.t().adminShipping.agencies.alerts.saveSuccess);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadMethods();
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || this.t().adminShipping.agencies.alerts.saveError;
        this.alertService.error(errMsg);
        this.saving.set(false);
      }
    });
  }

  onDelete(m: ShipmentMethod) {
    this.modalService.open({
      title: this.t().adminShipping.agencies.confirmDelete.title,
      message: this.t().adminShipping.agencies.confirmDelete.message.replace('{name}', m.methodName),
      severity: 'danger',
      confirmLabel: this.t().adminShipping.agencies.confirmDelete.confirmLabel,
      onConfirm: () => {
        this.shipmentService.deleteMethod(m.idShipmentMethod).subscribe({
          next: () => {
            this.alertService.success(this.t().adminShipping.agencies.alerts.deleteSuccess);
            this.loadMethods();
          },
          error: (err: any) => {
            const errMsg = err?.error?.message || this.t().adminShipping.agencies.alerts.deleteError;
            this.alertService.error(errMsg);
          }
        });
      }
    });
  }
}
