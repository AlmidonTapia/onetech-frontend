import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { Order, OrderStatus } from '../../../../../core/domains/checkout/models/order.model';

@Component({
  selector: 'app-order-status-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, SelectModule, TagModule, ButtonComponent, CurrencyPenPipe],
  templateUrl: './order-status-form.html'
})
export class OrderStatusFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible: boolean = false;
  @Input() order: Order | null = null;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<OrderStatus>();
  @Output() cancel = new EventEmitter<void>();
  get content() {
    return {
      dialogWidth: '440px',
      headerTitle: 'Cambiar estado de orden',
      idPrefix: '#',
      labels: {
        order: 'Orden:',
        client: 'Cliente:',
        total: 'Total:',
        newStatus: 'Nuevo estado *'
      },
      placeholderSelect: 'Seleccionar estado',
      styles: {
        selectWidth: '100%'
      },
      actions: {
        cancelLabel: 'Cancelar',
        saveLabel: 'Actualizar estado',
        saveIcon: 'pi-check'
      }
    };
  }

  form = this.fb.group({ status: ['' as OrderStatus, Validators.required] });

  get statusOptions(): { label: string; value: OrderStatus }[] {
    return [
      { label: 'Pendiente', value: 'PENDIENTE' },
      { label: 'Pagado', value: 'PAGADO' },
      { label: 'Enviado', value: 'ENVIADO' },
      { label: 'Completado', value: 'COMPLETADO' },
      { label: 'Cancelado', value: 'CANCELADO' },
    ];
  }

  get filteredOptions() {
    if (!this.order) return [];
    const current = this.order.orderStatus;
    
    if (current === 'COMPLETADO' || current === 'CANCELADO') {
      return this.statusOptions.filter(o => o.value === current);
    }
    
    const allowed: OrderStatus[] = [current];
    if (current === 'PENDIENTE') {
      allowed.push('PAGADO');
      allowed.push('CANCELADO');
    } else if (current === 'PAGADO') {
      allowed.push('ENVIADO');
      allowed.push('CANCELADO');
    } else if (current === 'ENVIADO') {
      allowed.push('COMPLETADO');
      allowed.push('CANCELADO');
    }
    
    return this.statusOptions.filter(o => allowed.includes(o.value));
  }

  ngOnChanges() {
    if (this.order) this.form.patchValue({ status: this.order.orderStatus });
  }

  onSave() {
    if (this.form.invalid) return;
    this.save.emit(this.form.value.status as OrderStatus);
  }

  onCancel() {
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
