import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { CardComponent } from '../../../shared/components/ui/card/card';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { PaymentService } from '../../../core/services/payment.service';
import { PaymentMethod, CreatePaymentMethodRequest } from '../../../core/models/payment.model';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [CommonModule, TableModule, ReactiveFormsModule, ButtonComponent, CardComponent, DialogModule],
  template: `
    <app-card [padding]="'none'">
      <div class="card-header">
        <div class="header-title">
          <h2>Métodos de Pago</h2>
          <span class="badge">{{ methods().length }} métodos</span>
        </div>
        <app-button variant="primary" label="Nuevo Método" icon="pi-plus" (clicked)="openCreate()" />
      </div>

      <div class="table-container">
        <p-table [value]="methods()" [loading]="loading()" styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th>Nombre del Método</th>
              <th>Estado</th>
              <th style="width: 120px; text-align: center;">Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-method>
            <tr>
              <td><strong>{{ method.methodName }}</strong></td>
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
              <td colspan="3" class="empty-state">No hay métodos de pago registrados.</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </app-card>

    <p-dialog [visible]="formVisible()" (visibleChange)="formVisible.set($event)" [header]="editingMethod() ? 'Editar Método de Pago' : 'Nuevo Método de Pago'" [style]="{width: '400px'}" [modal]="true">
      <form [formGroup]="form" (ngSubmit)="onSave()" class="modal-form">
        <div class="form-grid">
          <div class="form-group">
            <label>Nombre del Método</label>
            <input type="text" formControlName="methodName" class="form-input" placeholder="Ej: Tarjeta de Crédito, PayPal" />
          </div>
          <div class="form-group" *ngIf="editingMethod()">
            <label>Estado</label>
            <select formControlName="status" class="form-select">
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <app-button variant="outline" label="Cancelar" type="button" (clicked)="formVisible.set(false)" />
          <app-button variant="primary" label="Guardar" type="submit" [loading]="saving()" [disabled]="form.invalid" />
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
    .form-input, .form-select { width: 100%; height: 42px; border: 1px solid var(--ot-border-color); border-radius: var(--ot-radius-md); background: var(--ot-bg-surface); color: var(--ot-text-main); padding: 0 12px; font-family: var(--ot-font-family); font-size: 14px; outline: none; transition: var(--ot-transition); }
    .form-input:focus, .form-select:focus { border-color: var(--p-primary-color); }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid var(--ot-border-color); }
  `]
})
export class PaymentMethodsComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);

  methods = signal<PaymentMethod[]>([]);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingMethod = signal<PaymentMethod | null>(null);

  form = this.fb.group({
    methodName: ['', Validators.required],
    status: ['ACTIVO']
  });

  ngOnInit() {
    this.loadMethods();
  }

  loadMethods() {
    this.loading.set(true);
    this.paymentService.getMethods().subscribe({
      next: r => {
        this.methods.set(r);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate() {
    this.editingMethod.set(null);
    this.form.reset({ methodName: '', status: 'ACTIVO' });
    this.formVisible.set(true);
  }

  openEdit(m: PaymentMethod) {
    this.editingMethod.set(m);
    this.form.reset({
      methodName: m.methodName,
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
      status: formVal.status || 'ACTIVO'
    };

    const currentMethod = this.editingMethod();
    const req$ = currentMethod
      ? this.paymentService.updateMethod(currentMethod.idPaymentMethod, data)
      : this.paymentService.createMethod(data);

    req$.subscribe({
      next: () => {
        this.alertService.success('Método de pago guardado');
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadMethods();
      },
      error: () => {
        this.alertService.error('Error al guardar método');
        this.saving.set(false);
      }
    });
  }

  onDelete(m: PaymentMethod) {
    this.modalService.open({
      title: '¿Eliminar método de pago?',
      message: `El método de pago "${m.methodName}" será eliminado de forma permanente.`,
      severity: 'danger',
      confirmLabel: 'Sí, eliminar',
      onConfirm: () => {
        this.paymentService.deleteMethod(m.idPaymentMethod).subscribe({
          next: () => {
            this.alertService.success('Método de pago eliminado exitosamente');
            this.loadMethods();
          },
          error: () => {
            this.alertService.error('Error al eliminar el método de pago');
          }
        });
      }
    });
  }
}
