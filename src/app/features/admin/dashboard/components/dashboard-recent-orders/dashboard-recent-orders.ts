import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { Order, OrderStatus } from '../../../../../core/models/order.model';
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

  readonly statusConfig: Record<OrderStatus, { label: string; severity: SeverityType }> = {
    PENDIENTE: { label: 'Pendiente', severity: 'warn' },
    PAGADO: { label: 'Pagado', severity: 'info' },
    EN_PROCESO: { label: 'En proceso', severity: 'info' },
    ENVIADO: { label: 'Enviado', severity: 'secondary' },
    ENTREGADO: { label: 'Entregado', severity: 'success' },
    CANCELADO: { label: 'Cancelado', severity: 'danger' },
  };

  getStatusLabel(status: any): string { return this.statusConfig[status as OrderStatus]?.label || status; }
  getStatusSeverity(status: any): SeverityType { return this.statusConfig[status as OrderStatus]?.severity || 'info'; }
}