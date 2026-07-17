import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { TranslationService } from '../../../../../core/services/translation.service';
import { DatePipe } from '@angular/common';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { BadgeComponent, BadgeVariant } from '../../../../../shared/components/ui/badge/badge';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Order, OrderStatus } from '../../../../../core/domains/checkout/models/order.model';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [DatePipe, CurrencyPenPipe, BadgeComponent, ButtonComponent],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.css'
})
export class OrdersListComponent {
  @Input() orders: Order[] = [];
  @Input() loading = false;
  @Output() viewDetail = new EventEmitter<Order>();
  ts = inject(TranslationService);
  t = this.ts.t;

  get statusMap(): Record<OrderStatus, { label: string; variant: BadgeVariant }> {
    return {
      'PENDIENTE': { label: this.t().orders.status.PENDIENTE, variant: 'warning' },
      'PAGADO': { label: this.t().orders.status.PAGADO, variant: 'info' },
      'ENVIADO': { label: this.t().orders.status.ENVIADO, variant: 'blue' },
      'COMPLETADO': { label: this.t().orders.status.COMPLETADO, variant: 'success' },
      'CANCELADO': { label: this.t().orders.status.CANCELADO, variant: 'error' },
      'EXPIRADO': { label: this.t().orders.status.EXPIRADO, variant: 'gray' }
    };
  }

  skeletonItems = Array(3).fill(0);
}
