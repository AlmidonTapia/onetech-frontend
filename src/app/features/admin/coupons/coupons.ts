import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CouponsTableComponent } from './components/coupons-table/coupons-table';
import { CouponFormComponent } from './components/coupon-form/coupon-form';
import { handleFormError } from '../../../shared/utils/form-error.util';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { CouponService } from '../../../core/domains/checkout/services/coupon.service';
import { Coupon, CreateCouponRequest } from '../../../core/domains/checkout/models/coupon.model';
import { TranslationService } from '../../../core/services/translation.service';

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
  ts = inject(TranslationService);
  t = this.ts.t;

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

  apiConfig = {
    pageSize: 10
  };

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
        this.alertService.success(isEditing ? this.t().adminCoupons.alerts.updateSuccess : this.t().adminCoupons.alerts.createSuccess);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadCoupons();
      },
      error: (err) => {
        const errorMsg = handleFormError(err, this.couponForm.form) || undefined;
        this.alertService.error(this.t().adminCoupons.alerts.saveError, errorMsg);
        this.saving.set(false);
      }
    });
  }

  onDelete(c: Coupon) {
    this.modalService.open({
      title: this.t().adminCoupons.confirmModal.title,
      message: this.t().adminCoupons.confirmModal.deleteMessage.replace('{code}', c.code),
      severity: 'danger',
      confirmLabel: this.t().adminCoupons.confirmModal.confirmLabel,
      onConfirm: () => {
        this.couponService.delete(c.idCoupon).subscribe({
          next: () => {
            this.alertService.success(this.t().adminCoupons.alerts.deleteSuccess);
            this.loadCoupons();
          },
          error: (err: any) => this.alertService.error(err?.error?.message || this.t().adminCoupons.alerts.deleteError)
        });
      },
    });
  }
}
