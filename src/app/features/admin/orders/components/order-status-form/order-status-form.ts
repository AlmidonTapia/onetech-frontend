import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { Order, OrderStatus } from '../../../../../core/domains/checkout/models/order.model';
import { TranslationService as AppTranslationService } from '../../../../../core/services/translation.service';

@Component({
  selector: 'app-order-status-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, SelectModule, TagModule, ButtonComponent, CurrencyPenPipe],
  templateUrl: './order-status-form.html',
  styleUrl: './order-status-form.css'
})
export class OrderStatusFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible: boolean = false;
  @Input() order: Order | null = null;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<OrderStatus>();
  @Output() cancel = new EventEmitter<void>();

  ts = inject(AppTranslationService);
  t = this.ts.t;

  get content() {
    return {
      dialogWidth: '440px',
      headerTitle: this.t().adminOrders.form.headerTitle,
      idPrefix: '#',
      labels: {
        order: this.t().adminOrders.form.labels.order,
        client: this.t().adminOrders.form.labels.client,
        total: this.t().adminOrders.form.labels.total,
        newStatus: this.t().adminOrders.form.labels.newStatus
      },
      placeholderSelect: this.t().adminOrders.form.placeholderSelect,
      styles: {
        selectWidth: '100%'
      },
      actions: {
        cancelLabel: this.t().adminOrders.form.actions.cancelLabel,
        saveLabel: this.t().adminOrders.form.actions.saveLabel,
        saveIcon: 'pi-check'
      }
    };
  }

  form = this.fb.group({ status: ['' as OrderStatus, Validators.required] });

  get statusOptions(): { label: string; value: OrderStatus }[] {
    return [
      { label: this.t().orders.status.PENDIENTE, value: 'PENDIENTE' },
      { label: this.t().orders.status.PAGADO, value: 'PAGADO' },
      { label: this.t().orders.status.ENVIADO, value: 'ENVIADO' },
      { label: this.t().orders.status.COMPLETADO, value: 'COMPLETADO' },
      { label: this.t().orders.status.CANCELADO, value: 'CANCELADO' },
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
