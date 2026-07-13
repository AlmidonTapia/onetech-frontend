import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  content = {
    orderPrefix: 'Pedido #',
    dateFormat: 'dd/MM/yyyy',
    productSuffixSingular: 'producto',
    productSuffixPlural: 'productos',
    actionBtnLabel: 'Ver detalle',
    actionBtnIcon: 'pi-eye',
    loadingLabel: 'Cargando tus pedidos...',
    emptyTitle: 'No tienes pedidos aún',
    emptyDescription: 'Historial de compras vacío. Explora la tienda para comenzar.'
  };

  readonly statusMap: Record<OrderStatus, { label: string; variant: BadgeVariant }> = {
    'PENDIENTE': { label: 'Pendiente', variant: 'warning' },
    'PAGADO': { label: 'Pagado', variant: 'info' },
    'ENVIADO': { label: 'Enviado', variant: 'blue' },
    'COMPLETADO': { label: 'Completado', variant: 'success' },
    'CANCELADO': { label: 'Cancelado', variant: 'error' },
    'EXPIRADO': { label: 'Expirado', variant: 'gray' }
  };

  skeletonItems = Array(3).fill(0);
}
