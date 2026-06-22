import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Coupon, CreateCouponRequest } from '../../../../../core/models/coupon.model';

@Component({
  selector: 'app-coupon-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, DialogModule, InputTextModule,
    InputNumberModule, SelectModule, ButtonComponent
  ],
  templateUrl: './coupon-form.html',
  styleUrl: './coupon-form.css'
})
export class CouponFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible = false;
  @Input() coupon: Coupon | null = null;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateCouponRequest>();
  @Output() cancel = new EventEmitter<void>();

  content = {
    dialogWidth: '500px',
    titleNew: 'Nuevo Cupón',
    titleEdit: 'Editar Cupón',
    errorRequired: 'Campo requerido',
    styles: {
      selectWidth: '100%',
      appendTo: 'body'
    },
    actions: {
      cancelLabel: 'Cancelar',
      saveLabel: 'Guardar Cupón',
      saveIcon: 'pi-check'
    },
    fields: {
      codeLabel: 'Código del Cupón *',
      codePlaceholder: 'Ej: VERANO2026',
      typeLabel: 'Tipo de Descuento *',
      valueLabel: 'Valor de Descuento *',
      startDateLabel: 'Fecha de Inicio (Opcional)',
      expirationLabel: 'Fecha de Expiración *',
      limitLabel: 'Límite de Usos (Opcional)',
      statusLabel: 'Estado'
    }
  } as const;

  discountTypes = [
    { label: 'Porcentaje', value: 'PERCENTAGE' },
    { label: 'Monto Fijo', value: 'FIXED_AMOUNT' }
  ];

  statuses = [
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' },
    { label: 'Agotado', value: 'AGOTADO' },
    { label: 'Expirado', value: 'EXPIRADO' }
  ];

  form = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(3)]],
    discountType: ['PERCENTAGE', Validators.required],
    discountValue: [0, [Validators.required, Validators.min(0.01)]],
    startDate: [''],
    expirationDate: ['', Validators.required],
    usageLimit: [null as number | null, [Validators.min(1)]],
    status: ['ACTIVO']
  });

  get title() {
    return this.coupon ? this.content.titleEdit : this.content.titleNew;
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }

  ngOnChanges() {
    if (this.coupon) {
      const dateFormatted = this.coupon.expirationDate
        ? new Date(this.coupon.expirationDate).toISOString().substring(0, 16)
        : '';
      const startFormatted = this.coupon.startDate
        ? new Date(this.coupon.startDate).toISOString().substring(0, 16)
        : '';
      this.form.reset({
        code: this.coupon.code,
        discountType: this.coupon.discountType,
        discountValue: this.coupon.discountValue,
        startDate: startFormatted,
        expirationDate: dateFormatted,
        usageLimit: this.coupon.usageLimit || null,
        status: this.coupon.status || 'ACTIVO'
      });
    } else {
      this.form.reset({
        discountType: 'PERCENTAGE',
        discountValue: 0,
        status: 'ACTIVO',
        usageLimit: null
      });
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const val = this.form.value;
    const req: CreateCouponRequest = {
      code: val.code!,
      discountType: val.discountType as any,
      discountValue: val.discountValue!,
      startDate: val.startDate ? new Date(val.startDate).toISOString() : undefined,
      expirationDate: new Date(val.expirationDate!).toISOString(),
      usageLimit: val.usageLimit ? val.usageLimit : undefined
    };
    const fullReq = {
      ...req,
      status: val.status
    };
    this.save.emit(fullReq as any);
  }

  onCancel() {
    this.form.reset({ discountType: 'PERCENTAGE', discountValue: 0, status: 'ACTIVO' });
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
