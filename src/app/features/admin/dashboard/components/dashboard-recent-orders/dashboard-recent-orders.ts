import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { Order, OrderStatus } from '../../../../../core/domains/checkout/models/order.model';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';

type SeverityType = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-dashboard-recent-orders',
  standalone: true,
  imports: [RouterLink, TagModule, CurrencyPenPipe, CommonModule],
  templateUrl: './dashboard-recent-orders.html'
})
export class DashboardRecentOrdersComponent {
  @Input() orders: Order[] = [];
  get content() {
    return {
      title: 'Órdenes recientes',
      viewAllLabel: 'Ver todas →',
      viewAllRoute: '/admin/orders',
      emptyMessage: 'No hay órdenes recientes.',
      idPrefix: '#'
    };
  }

  get statusConfig(): Record<OrderStatus, { label: string; severity: SeverityType }> {
    return {
      PENDIENTE: { label: 'Pendiente', severity: 'warn' },
      PAGADO: { label: 'Pagado', severity: 'info' },
      ENVIADO: { label: 'Enviado', severity: 'secondary' },
      COMPLETADO: { label: 'Completado', severity: 'success' },
      CANCELADO: { label: 'Cancelado', severity: 'danger' },
      EXPIRADO: { label: 'Expirado', severity: 'danger' }
    };
  }

  getStatusLabel(status: any): string {
    return this.statusConfig[status as OrderStatus]?.label || status;
  }

  getStatusSeverity(status: any): SeverityType {
    return this.statusConfig[status as OrderStatus]?.severity || 'info';
  }
}
