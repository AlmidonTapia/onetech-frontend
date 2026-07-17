import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { PaymentService } from '../../../core/domains/checkout/services/payment.service';
import { PaymentMethod } from '../../../core/domains/checkout/models/payment.model';
import { PaymentMethodsTableComponent } from './components/payment-methods-table/payment-methods-table';
import { PaymentMethodFormComponent } from './components/payment-method-form/payment-method-form';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent,  PaymentMethodsTableComponent, PaymentMethodFormComponent],
  templateUrl: './payment-methods.html',
  styleUrl: './payment-methods.css'
})
export class PaymentMethodsComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);
  ts = inject(TranslationService);
  t = this.ts.t;

  methods = signal<PaymentMethod[]>([]);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingMethod = signal<PaymentMethod | null>(null);
  searchTerm = signal<string | undefined>(undefined);

  get content() {
    return {
      title: this.t().adminPaymentMethods.title,
      badgeSuffix: this.t().adminPaymentMethods.badgeSuffix,
      newBtnLabel: this.t().adminPaymentMethods.newBtnLabel,
      table: {
        quickSearchTitle: this.t().adminPaymentMethods.table.quickSearchTitle,
        searchPlaceholder: this.t().adminPaymentMethods.table.searchPlaceholder,
        headers: {
          name: this.t().adminPaymentMethods.table.headers.name,
          status: this.t().adminPaymentMethods.table.headers.status,
          actions: this.t().adminPaymentMethods.table.headers.actions
        },
        emptyMsg: this.t().adminPaymentMethods.table.emptyMessage
      }
    };
  }

  form = this.fb.group({
    methodName: ['', Validators.required],
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
    this.paymentService.getMethods(this.searchTerm()).subscribe({
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
        this.alertService.success(this.t().adminPaymentMethods.alerts.saveSuccess);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadMethods();
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || this.t().adminPaymentMethods.alerts.saveError;
        this.alertService.error(errMsg);
        this.saving.set(false);
      }
    });
  }

  onDelete(m: PaymentMethod) {
    this.modalService.open({
      title: this.t().adminPaymentMethods.confirmDelete.title,
      message: this.t().adminPaymentMethods.confirmDelete.message.replace('{name}', m.methodName),
      severity: 'danger',
      confirmLabel: this.t().adminPaymentMethods.confirmDelete.confirmLabel,
      onConfirm: () => {
        this.paymentService.deleteMethod(m.idPaymentMethod).subscribe({
          next: () => {
            this.alertService.success(this.t().adminPaymentMethods.alerts.deleteSuccess);
            this.loadMethods();
          },
          error: (err: any) => {
            const errMsg = err?.error?.message || this.t().adminPaymentMethods.alerts.deleteError;
            this.alertService.error(errMsg);
          }
        });
      }
    });
  }
}
