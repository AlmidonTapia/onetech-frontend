import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { Order, OrderStatus } from '../../../../../core/models/order.model';

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

  form = this.fb.group({ status: ['' as OrderStatus, Validators.required] });

  readonly statusOptions: { label: string; value: OrderStatus }[] = [
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Pagado', value: 'PAGADO' },
    { label: 'En proceso', value: 'EN_PROCESO' },
    { label: 'Enviado', value: 'ENVIADO' },
    { label: 'Entregado', value: 'ENTREGADO' },
    { label: 'Cancelado', value: 'CANCELADO' },
  ];

  ngOnChanges() {
    if (this.order) this.form.patchValue({ status: this.order.status });
  }

  onSave() {
    if (this.form.invalid) return;
    this.save.emit(this.form.value.status as OrderStatus);
  }

  onCancel() { this.cancel.emit(); this.visibleChange.emit(false); }
}