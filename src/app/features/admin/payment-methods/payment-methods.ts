import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { PaymentService } from '../../../core/domains/checkout/services/payment.service';
import { PaymentMethod } from '../../../core/domains/checkout/models/payment.model';
import { PaymentMethodsTableComponent } from './components/payment-methods-table/payment-methods-table';
import { PaymentMethodFormComponent } from './components/payment-method-form/payment-method-form';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent,  PaymentMethodsTableComponent, PaymentMethodFormComponent],
  templateUrl: './payment-methods.html'
})
export class PaymentMethodsComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  methods = signal<PaymentMethod[]>([]);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingMethod = signal<PaymentMethod | null>(null);
  searchTerm = signal<string | undefined>(undefined);

  get content() {
    return {
      title: 'Métodos de Pago',
      badgeSuffix: ' métodos',
      newBtnLabel: 'Nuevo Método',
      table: {
        quickSearchTitle: 'Búsqueda Rápida',
        searchPlaceholder: 'Buscar método...',
        headers: {
          name: 'Nombre',
          status: 'Estado',
          actions: 'Acciones'
        },
        emptyMessage: 'No hay métodos de pago registrados.'
      },
      form: {
        titleNew: 'Nuevo Método',
        titleEdit: 'Editar Método',
        labels: {
          name: 'Nombre del Método',
          status: 'Estado'
        },
        placeholders: {
          name: 'Ej: Tarjeta de Crédito'
        },
        statusOptions: {
          active: 'Activo',
          inactive: 'Inactivo'
        },
        buttons: {
          cancel: 'Cancelar',
          save: 'Guardar'
        }
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
    this.paymentService.getMethods(this.searchTerm()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

    req$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Método de pago guardado con éxito');
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadMethods();
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || 'Error al guardar el método de pago';
        this.alertService.error(errMsg);
        this.saving.set(false);
      }
    });
  }

  onDelete(m: PaymentMethod) {
    this.modalService.open({
      title: '¿Eliminar método de pago?',
      message: 'Se eliminará de forma permanente.',
      confirmLabel: 'Sí, eliminar',
      onConfirm: () => {
        this.paymentService.deleteMethod(m.idPaymentMethod).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => {
            this.alertService.success('Método de pago eliminado con éxito');
            this.loadMethods();
          },
          error: (err: any) => {
            const errMsg = err?.error?.message || 'Error al eliminar el método de pago';
            this.alertService.error(errMsg);
          }
        });
      }
    });
  }
}
