import { Component, OnInit, inject, signal } from '@angular/core';
import { CouponsTableComponent } from './components/coupons-table/coupons-table';
import { CouponFormComponent } from './components/coupon-form/coupon-form';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { CardComponent } from '../../../shared/components/ui/card/card';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { CouponService } from '../../../core/services/coupon.service';
import { Coupon, CreateCouponRequest } from '../../../core/models/coupon.model';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CouponsTableComponent, CouponFormComponent, ButtonComponent, CardComponent],
  templateUrl: './coupons.html',
  styleUrl: './coupons.css'
})
export class CouponsComponent implements OnInit {
  private couponService = inject(CouponService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);

  coupons = signal<Coupon[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingCoupon = signal<Coupon | null>(null);

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
      error: () => {
        this.alertService.error(this.content.alerts.saveError);
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
          error: () => this.alertService.error(this.content.alerts.deleteError)
        });
      },
    });
  }
}
