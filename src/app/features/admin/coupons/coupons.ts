import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { CardComponent } from '../../../shared/components/ui/card/card';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { CouponService } from '../../../core/services/coupon.service';
import { Coupon, CreateCouponRequest } from '../../../core/models/coupon.model';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule, TableModule, TooltipModule, ReactiveFormsModule, ButtonComponent, CardComponent, DialogModule],
  template: `
    <app-card [padding]="'none'">
      <div class="card-header">
        <div class="header-title">
          <h2>Cupones</h2>
          <span class="badge">{{ totalRecords() }} cupones registrados</span>
        </div>
        <app-button variant="primary" label="Nuevo Cupón" icon="pi-plus" (clicked)="openCreate()" />
      </div>

      <div class="table-container">
        <p-table [value]="coupons()" [lazy]="true" (onLazyLoad)="loadCoupons($event)"
                 [paginator]="true" [rows]="10" [totalRecords]="totalRecords()"
                 [loading]="loading()" styleClass="p-datatable-sm">
          <ng-template pTemplate="header">
            <tr>
              <th>Código</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Expiración</th>
              <th>Límite de Uso</th>
              <th>Activo</th>
              <th style="width: 100px; text-align: center;">Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-coupon>
            <tr>
              <td><strong>{{ coupon.code }}</strong></td>
              <td>{{ coupon.discountType }}</td>
              <td>{{ coupon.discountValue }}</td>
              <td>{{ coupon.expirationDate | date }}</td>
              <td>{{ coupon.usageLimit || 'Sin límite' }}</td>
              <td>
                <span class="status-badge" [class.status-active]="coupon.active" [class.status-inactive]="!coupon.active">
                  {{ coupon.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-action btn-delete" pTooltip="Eliminar" (click)="onDelete(coupon)">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="empty-state">No hay cupones registrados.</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </app-card>

    <p-dialog [visible]="formVisible()" (visibleChange)="formVisible.set($event)" [header]="'Nuevo Cupón'" [style]="{width: '500px'}" [modal]="true">
      <form [formGroup]="form" (ngSubmit)="onSave()" class="modal-form">
        <div class="form-grid">
          <div class="form-group">
            <label>Código del Cupón</label>
            <input type="text" formControlName="code" class="form-input" placeholder="Ej: VERANO2026" />
          </div>
          <div class="form-group">
            <label>Tipo de Descuento</label>
            <select formControlName="discountType" class="form-select">
              <option value="PERCENTAGE">Porcentaje</option>
              <option value="FIXED_AMOUNT">Monto Fijo</option>
            </select>
          </div>
          <div class="form-group">
            <label>Valor de Descuento</label>
            <input type="number" formControlName="discountValue" class="form-input" />
          </div>
          <div class="form-group">
            <label>Fecha de Expiración</label>
            <input type="date" formControlName="expirationDate" class="form-input" />
          </div>
          <div class="form-group">
            <label>Límite de Usos (Opcional)</label>
            <input type="number" formControlName="usageLimit" class="form-input" />
          </div>
        </div>
        <div class="modal-actions">
          <app-button variant="outline" label="Cancelar" type="button" (clicked)="formVisible.set(false)" />
          <app-button variant="primary" label="Guardar Cupón" type="submit" [loading]="saving()" [disabled]="form.invalid" />
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
    .action-buttons { display: flex; justify-content: center; gap: 8px; }
    .btn-action { width: 32px; height: 32px; border-radius: var(--ot-radius-md); border: none; background: transparent; cursor: pointer; transition: var(--ot-transition); display: flex; align-items: center; justify-content: center; }
    .btn-action:hover { background: var(--ot-bg-subtle); }
    .btn-delete:hover { color: var(--ot-danger); background: color-mix(in srgb, var(--ot-danger) 10%, transparent); }
    .empty-state { text-align: center; padding: 32px; color: var(--ot-text-muted); font-style: italic; }
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
export class CouponsComponent implements OnInit {
  private couponService = inject(CouponService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);

  coupons = signal<Coupon[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);

  form = this.fb.group({
    code: ['', Validators.required],
    discountType: ['PERCENTAGE', Validators.required],
    discountValue: [0, [Validators.required, Validators.min(0.01)]],
    expirationDate: ['', Validators.required],
    usageLimit: [null]
  });

  ngOnInit() {
    this.loadCoupons();
  }

  loadCoupons(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.couponService.getAll(page, 10).subscribe({
      next: r => {
        this.coupons.set(r.content);
        this.totalRecords.set(r.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate() {
    this.form.reset({ discountType: 'PERCENTAGE', discountValue: 0 });
    this.formVisible.set(true);
  }

  onSave() {
    if (this.form.invalid) return;
    this.saving.set(true);
    
    // Formatear fecha para el backend (espera string de fecha)
    const formVal = this.form.value;
    const data: CreateCouponRequest = {
      code: formVal.code!,
      discountType: formVal.discountType as 'PERCENTAGE' | 'FIXED_AMOUNT',
      discountValue: formVal.discountValue!,
      expirationDate: new Date(formVal.expirationDate!).toISOString(),
      usageLimit: formVal.usageLimit ? formVal.usageLimit : undefined
    };

    this.couponService.create(data).subscribe({
      next: () => {
        this.alertService.success('Cupón guardado');
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadCoupons();
      },
      error: () => {
        this.alertService.error('Error al guardar cupón');
        this.saving.set(false);
      }
    });
  }

  onDelete(c: Coupon) {
    this.modalService.open({
      title: '¿Eliminar cupón?',
      message: `El cupón "${c.code}" será eliminado.`,
      severity: 'danger',
      confirmLabel: 'Sí, eliminar',
      onConfirm: () => {
        this.couponService.delete(c.idCoupon).subscribe({
          next: () => {
            this.alertService.success('Cupón eliminado');
            this.loadCoupons();
          },
          error: () => this.alertService.error('Error al eliminar cupón')
        });
      },
    });
  }
}
