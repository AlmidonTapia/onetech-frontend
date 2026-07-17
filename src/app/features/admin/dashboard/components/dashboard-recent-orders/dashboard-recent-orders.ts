import { Component, Input, inject } from '@angular/core';
import { TranslationService } from '../../../../../core/services/translation.service';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { Order, OrderStatus } from '../../../../../core/domains/checkout/models/order.model';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';

type SeverityType = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-dashboard-recent-orders',
  standalone: true,
  imports: [RouterLink, TagModule, CurrencyPenPipe],
  templateUrl: './dashboard-recent-orders.html',
  styleUrl: './dashboard-recent-orders.css'
})
export class DashboardRecentOrdersComponent {
  @Input() orders: Order[] = [];

  ts = inject(TranslationService);
  t = this.ts.t;

  get content() {
    return {
      title: this.t().adminDashboard.recentOrders.title,
      viewAllLabel: this.t().adminDashboard.recentOrders.viewAllLabel,
      viewAllRoute: '/admin/orders',
      emptyMessage: this.t().adminDashboard.recentOrders.emptyMessage,
      idPrefix: '#'
    };
  }

  get statusConfig(): Record<OrderStatus, { label: string; severity: SeverityType }> {
    return {
      PENDIENTE: { label: this.t().orders.status.PENDIENTE, severity: 'warn' },
      PAGADO: { label: this.t().orders.status.PAGADO, severity: 'info' },
      ENVIADO: { label: this.t().orders.status.ENVIADO, severity: 'secondary' },
      COMPLETADO: { label: this.t().orders.status.COMPLETADO, severity: 'success' },
      CANCELADO: { label: this.t().orders.status.CANCELADO, severity: 'danger' },
      EXPIRADO: { label: this.t().orders.status.EXPIRADO, severity: 'danger' }
    };
  }

  getStatusLabel(status: any): string {
    return this.statusConfig[status as OrderStatus]?.label || status;
  }

  getStatusSeverity(status: any): SeverityType {
    return this.statusConfig[status as OrderStatus]?.severity || 'info';
  }
}
