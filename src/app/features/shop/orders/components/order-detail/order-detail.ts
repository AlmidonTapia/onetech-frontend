import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { BadgeComponent, BadgeVariant } from '../../../../../shared/components/ui/badge/badge';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Order, OrderStatus } from '../../../../../core/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [DialogModule, TagModule, CurrencyPenPipe, BadgeComponent, ButtonComponent, DatePipe],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetailComponent {
  @Input() visible = false;
  @Input() order: Order | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  content = {
    headerPrefix: 'Pedido #',
    dialogWidth: '600px',
    dateFormat: 'dd MMMM yyyy, HH:mm',
    sections: {
      productsTitle: 'Productos',
      infoTitle: 'Información del pedido'
    },
    totals: {
      subtotalLabel: 'Subtotal',
      grandTotalLabel: 'Total pagado',
      unitSuffix: ' c/u'
    },
    labels: {
      client: 'Cliente',
      orderId: 'ID de orden'
    },
    actions: {
      closeLabel: 'Cerrar'
    }
  };

  readonly statusMap: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
    PENDIENTE: { label: 'Pendiente', variant: 'warning' },
    PAGADO: { label: 'Pagado', variant: 'info' },
    ENVIADO: { label: 'Enviado', variant: 'blue' },
    COMPLETADO: { label: 'Completado', variant: 'success' },
    CANCELADO: { label: 'Cancelado', variant: 'error' }
  };

  close() { this.visibleChange.emit(false); }
}
