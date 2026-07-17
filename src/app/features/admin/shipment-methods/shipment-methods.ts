import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { ShipmentService } from '../../../core/domains/shipping/services/shipment.service';
import { ShipmentMethod } from '../../../core/domains/shipping/models/shipment.model';
import { ShipmentsMethodTableComponent } from './components/shipments-method-table/shipments-method-table';
import { ShipmentMethodFormComponent } from './components/shipment-method-form/shipment-method-form';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-shipment-methods',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent,  ShipmentsMethodTableComponent, ShipmentMethodFormComponent],
  templateUrl: './shipment-methods.html',
  styleUrl: './shipment-methods.css'
})
export class ShipmentMethodsComponent implements OnInit {
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
      { label: this.t().adminShipmentMethods.statuses.active, value: 'ACTIVO' },
      { label: this.t().adminShipmentMethods.statuses.inactive, value: 'INACTIVO' }
    ];
  }

  get content() {
    return {
      title: this.t().adminShipmentMethods.title,
      badgeSuffix: this.t().adminShipmentMethods.badgeSuffix,
      newBtnLabel: this.t().adminShipmentMethods.newBtnLabel,
      newBtnIcon: 'pi-plus',
      table: {
        quickSearchTitle: this.t().adminShipmentMethods.table.quickSearchTitle,
        searchPlaceholder: this.t().adminShipmentMethods.table.searchPlaceholder,
        headers: {
          name: this.t().adminShipmentMethods.table.headers.name,
          price: this.t().adminShipmentMethods.table.headers.price,
          status: this.t().adminShipmentMethods.table.headers.status,
          actions: this.t().adminShipmentMethods.table.headers.actions
        },
        emptyMsg: this.t().adminShipmentMethods.table.emptyMsg
      },
      dialog: {
        createTitle: this.t().adminShipmentMethods.dialog.createTitle,
        editTitle: this.t().adminShipmentMethods.dialog.editTitle,
        fields: {
          name: this.t().adminShipmentMethods.dialog.fields.name,
          namePlaceholder: this.t().adminShipmentMethods.dialog.fields.namePlaceholder,
          price: this.t().adminShipmentMethods.dialog.fields.price,
          status: this.t().adminShipmentMethods.dialog.fields.status,
          statusPlaceholder: this.t().adminShipmentMethods.dialog.fields.statusPlaceholder
        },
        actions: {
          cancel: this.t().adminShipmentMethods.dialog.actions.cancel,
          save: this.t().adminShipmentMethods.dialog.actions.save
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
        this.alertService.success(this.t().adminShipmentMethods.alerts.saveSuccess);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadMethods();
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || this.t().adminShipmentMethods.alerts.saveError);
        this.saving.set(false);
      }
    });
  }

  onDelete(m: ShipmentMethod) {
    this.modalService.open({
      title: this.t().adminShipmentMethods.confirmDelete.title,
      message: this.t().adminShipmentMethods.confirmDelete.message.replace('{name}', m.methodName),
      severity: 'danger',
      confirmLabel: this.t().adminShipmentMethods.confirmDelete.confirmLabel,
      onConfirm: () => {
        this.shipmentService.deleteMethod(m.idShipmentMethod).subscribe({
          next: () => {
            this.alertService.success(this.t().adminShipmentMethods.alerts.deleteSuccess);
            this.loadMethods();
          },
          error: (err: any) => {
            this.alertService.error(err?.error?.message || this.t().adminShipmentMethods.alerts.deleteError);
          }
        });
      }
    });
  }
}
