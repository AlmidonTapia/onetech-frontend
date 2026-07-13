import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CouponsTableComponent } from './components/coupons-table/coupons-table';
import { CouponFormComponent } from './components/coupon-form/coupon-form';
import { handleFormError } from '../../../shared/utils/form-error.util';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { CouponService } from '../../../core/domains/checkout/services/coupon.service';
import { Coupon, CreateCouponRequest } from '../../../core/domains/checkout/models/coupon.model';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CouponsTableComponent, CouponFormComponent, ButtonComponent],
  templateUrl: './coupons.html',
  styleUrl: './coupons.css'
})
export class CouponsComponent implements OnInit {
  private couponService = inject(CouponService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);

  @ViewChild(CouponFormComponent) couponForm!: CouponFormComponent;

  coupons = signal<Coupon[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingCoupon = signal<Coupon | null>(null);
  searchTerm = signal<string | undefined>(undefined);
  filterType = signal<string | undefined>(undefined);
  filterStatus = signal<string | undefined>(undefined);

  content = {
    title: 'Cupones',
    countSuffix: 'cupones registrados',
    createBtnLabel: 'Nuevo Cupón',
    createBtnIcon: 'pi-plus',
    cardPadding: 'none',
    alerts: {
      createSuccess: 'Cupón creado',
      updateSuccess: 'Cupón actualizado',
      saveError: 'Error al guardar cupón',
      deleteSuccess: 'Cupón eliminado',
      deleteError: 'Error al eliminar cupón'
    },
    confirmModal: {
      title: '¿Eliminar cupón?',
      severity: 'danger' as const,
      confirmLabel: 'Sí, eliminar'
    }
  } as const;

  ngOnInit() {
    this.loadCoupons();
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.loadCoupons({ first: 0, rows: 10 });
  }

  onFilterChange(filters: { type: string, status: string }) {
    this.filterType.set(filters.type === 'ALL' ? undefined : filters.type);
    this.filterStatus.set(filters.status === 'ALL' ? undefined : filters.status);
    this.loadCoupons({ first: 0, rows: 10 });
  }

  loadCoupons(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.couponService.getAll(page, 10, this.searchTerm(), this.filterType(), this.filterStatus()).subscribe({
      next: r => {
        this.coupons.set(r.content);
        this.totalRecords.set(r.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate() {
    this.editingCoupon.set(null);
    this.formVisible.set(true);
  }

  openEdit(c: Coupon) {
    this.editingCoupon.set(c);
    this.formVisible.set(true);
  }

  onSave(data: CreateCouponRequest) {
    this.saving.set(true);
    const isEditing = !!this.editingCoupon();
    
    const req$ = isEditing
      ? this.couponService.update(this.editingCoupon()!.idCoupon, data)
      : this.couponService.create(data);

    req$.subscribe({
      next: () => {
        this.alertService.success(isEditing ? this.content.alerts.updateSuccess : this.content.alerts.createSuccess);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadCoupons();
      },
      error: (err) => {
        const errorMsg = handleFormError(err, this.couponForm.form) || undefined;
        this.alertService.error(this.content.alerts.saveError, errorMsg);
        this.saving.set(false);
      }
    });
  }

  onDelete(c: Coupon) {
    this.modalService.open({
      title: this.content.confirmModal.title,
      message: `El cupón "${c.code}" será eliminado permanentemente.`,
      severity: this.content.confirmModal.severity,
      confirmLabel: this.content.confirmModal.confirmLabel,
      onConfirm: () => {
        this.couponService.delete(c.idCoupon).subscribe({
          next: () => {
            this.alertService.success(this.content.alerts.deleteSuccess);
            this.loadCoupons();
          },
          error: (err: any) => this.alertService.error(err?.error?.message || this.content.alerts.deleteError)
        });
      },
    });
  }
}
