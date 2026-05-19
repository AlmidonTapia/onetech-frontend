import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { CardComponent } from '../../../shared/components/ui/card/card';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { ShipmentService } from '../../../core/services/shipment.service';
import { ShipmentMethod } from '../../../core/models/shipment.model';
import { CurrencyPenPipe } from '../../../shared/pipes/currency-pen.pipe';

@Component({
  selector: 'app-shipment-methods',
  standalone: true,
  imports: [CommonModule, TableModule, ReactiveFormsModule, ButtonComponent, CardComponent, DialogModule, SelectModule, CurrencyPenPipe],
  template: `
    <app-card [padding]="'none'">
      <div class="card-header">
        <div class="header-title">
          <h2>{{ content.title }}</h2>
          <span class="badge">{{ methods().length }}{{ content.badgeSuffix }}</span>
        </div>
        <app-button variant="primary" [label]="content.newBtnLabel" [icon]="content.newBtnIcon" (clicked)="openCreate()" />
      </div>

      <div class="table-container">
        <p-table [value]="methods()" [loading]="loading()" styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th>{{ content.table.headers.name }}</th>
              <th>{{ content.table.headers.price }}</th>
              <th>{{ content.table.headers.status }}</th>
              <th style="width: 120px; text-align: center;">{{ content.table.headers.actions }}</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-method>
            <tr>
              <td><strong>{{ method.methodName }}</strong></td>
              <td>{{ method.basePrice | currencyPen }}</td>
              <td>
                <span class="status-badge" [class.status-active]="method.status === 'ACTIVO'" [class.status-inactive]="method.status !== 'ACTIVO'">
                  {{ method.status || 'ACTIVO' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-action btn-edit" (click)="openEdit(method)">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button class="btn-action btn-delete" (click)="onDelete(method)">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="4" class="empty-state">{{ content.table.emptyMsg }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </app-card>

    <p-dialog [visible]="formVisible()" (visibleChange)="formVisible.set($event)" [header]="editingMethod() ? content.dialog.editTitle : content.dialog.createTitle" [style]="{width: '400px'}" [modal]="true">
      <form [formGroup]="form" (ngSubmit)="onSave()" class="modal-form">
        <div class="form-grid">
          <div class="form-group">
            <label>{{ content.dialog.fields.name }}</label>
            <input type="text" formControlName="methodName" class="form-input" [placeholder]="content.dialog.fields.namePlaceholder" />
          </div>
          <div class="form-group">
            <label>{{ content.dialog.fields.price }}</label>
            <input type="number" formControlName="basePrice" class="form-input" />
          </div>
          <div class="form-group" *ngIf="editingMethod()">
            <label>{{ content.dialog.fields.status }}</label>
            <p-select formControlName="status" [options]="statuses" optionLabel="label" optionValue="value" [placeholder]="content.dialog.fields.statusPlaceholder" [style]="{width: '100%'}" appendTo="body"></p-select>
          </div>
        </div>
        <div class="modal-actions">
          <app-button variant="outline" [label]="content.dialog.actions.cancel" type="button" (clicked)="formVisible.set(false)" />
          <app-button variant="primary" [label]="content.dialog.actions.save" type="submit" [loading]="saving()" [disabled]="form.invalid" />
        </div>
      </form>
    </p-dialog>
  `,
  styles: [`
    .card-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--ot-border-color); }
    .header-title { display: flex; align-items: center; gap: 12px; }
    .header-title h2 { margin: 0; font-size: 18px; font-weight: 700; color: var(--ot-text-main); }
    .badge { background: var(--ot-bg-subtle); color: var(--ot-text-muted); padding: 4px 10px; border-radius: var(--ot-radius-full); font-size: 12px; font-weight: 600; }
    .table-container { padding: 0 24px 24px; }
    .empty-state { text-align: center; padding: 32px; color: var(--ot-text-muted); font-style: italic; }
    .text-muted { color: var(--ot-text-muted); }
    .action-buttons { display: flex; justify-content: center; gap: 8px; }
    .btn-action { width: 32px; height: 32px; border-radius: var(--ot-radius-md); border: none; background: transparent; cursor: pointer; transition: var(--ot-transition); display: flex; align-items: center; justify-content: center; }
    .btn-action:hover { background: var(--ot-bg-subtle); }
    .btn-edit:hover { color: var(--p-primary-color); background: color-mix(in srgb, var(--p-primary-color) 10%, transparent); }
    .btn-delete:hover { color: var(--ot-danger); background: color-mix(in srgb, var(--ot-danger) 10%, transparent); }
    .status-badge { padding: 4px 8px; border-radius: var(--ot-radius-md); font-size: 12px; font-weight: 600; }
    .status-active { background: color-mix(in srgb, var(--ot-success) 15%, transparent); color: var(--ot-success); }
    .status-inactive { background: color-mix(in srgb, var(--ot-danger) 15%, transparent); color: var(--ot-danger); }
    .modal-form { display: flex; flex-direction: column; gap: 24px; padding: 8px 0; }
    .form-grid { display: flex; flex-direction: column; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-size: 13px; font-weight: 600; color: var(--ot-text-main); }
    .form-input { width: 100%; height: 42px; border: 1px solid var(--ot-border-color); border-radius: var(--ot-radius-md); background: var(--ot-bg-surface); color: var(--ot-text-main); padding: 0 12px; font-family: var(--ot-font-family); font-size: 14px; outline: none; transition: var(--ot-transition); }
    .form-input:focus { border-color: var(--p-primary-color); }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid var(--ot-border-color); }
  `]
})
export class ShipmentMethodsComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);

  methods = signal<ShipmentMethod[]>([]);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingMethod = signal<ShipmentMethod | null>(null);

  statuses = [
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' }
  ];

  content = {
    title: 'Métodos de Envío',
    badgeSuffix: ' métodos',
    newBtnLabel: 'Nuevo Método',
    newBtnIcon: 'pi-plus',
    table: {
      headers: {
        name: 'Nombre del Método',
        price: 'Precio Base',
        status: 'Estado',
        actions: 'Acciones'
      },
      emptyMsg: 'No hay métodos de envío registrados.'
    },
    dialog: {
      createTitle: 'Nuevo Método de Envío',
      editTitle: 'Editar Método de Envío',
      fields: {
        name: 'Nombre del Método',
        namePlaceholder: 'Ej: Express',
        price: 'Precio Base (S/)',
        status: 'Estado',
        statusPlaceholder: 'Seleccione un estado'
      },
      actions: {
        cancel: 'Cancelar',
        save: 'Guardar'
      }
    },
    confirmDelete: {
      title: '¿Eliminar método de envío?',
      message: (name: string) => `El método de envío "${name}" será eliminado de forma permanente.`,
      confirmLabel: 'Sí, eliminar',
      severity: 'danger'
    },
    alerts: {
      saveSuccess: 'Método de envío guardado',
      saveError: 'Error al guardar método',
      deleteSuccess: 'Método de envío eliminado exitosamente',
      deleteError: 'Error al eliminar el método de envío'
    }
  };

  form = this.fb.group({
    methodName: ['', Validators.required],
    basePrice: [0, [Validators.required, Validators.min(0)]],
    status: ['ACTIVO']
  });

  ngOnInit() {
    this.loadMethods();
  }

  loadMethods() {
    this.loading.set(true);
    this.shipmentService.getMethods().subscribe({
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
        this.alertService.success(this.content.alerts.saveSuccess);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadMethods();
      },
      error: () => {
        this.alertService.error(this.content.alerts.saveError);
        this.saving.set(false);
      }
    });
  }

  onDelete(m: ShipmentMethod) {
    this.modalService.open({
      title: this.content.confirmDelete.title,
      message: this.content.confirmDelete.message(m.methodName),
      severity: this.content.confirmDelete.severity as any,
      confirmLabel: this.content.confirmDelete.confirmLabel,
      onConfirm: () => {
        this.shipmentService.deleteMethod(m.idShipmentMethod).subscribe({
          next: () => {
            this.alertService.success(this.content.alerts.deleteSuccess);
            this.loadMethods();
          },
          error: () => {
            this.alertService.error(this.content.alerts.deleteError);
          }
        });
      }
    });
  }
}
