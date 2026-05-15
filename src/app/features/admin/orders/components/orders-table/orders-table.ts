import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DatePipe } from '@angular/common';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { Order, OrderStatus } from '../../../../../core/models/order.model';

type SeverityType = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [TableModule, TagModule, TooltipModule, CurrencyPenPipe, DatePipe],
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.css'
})
export class OrdersTableComponent {
  @Input() orders: Order[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() changeStatus = new EventEmitter<Order>();
  @Output() viewDetail = new EventEmitter<Order>();

  readonly statusConfig: Record<OrderStatus, { label: string; severity: SeverityType }> = {
    PENDIENTE: { label: 'Pendiente', severity: 'warn' },
    PAGADO: { label: 'Pagado', severity: 'info' },
    ENVIADO: { label: 'Enviado', severity: 'secondary' },
    COMPLETADO: { label: 'Completado', severity: 'success' },
    CANCELADO: { label: 'Cancelado', severity: 'danger' },
  };

  getStatusLabel(status: any): string { return this.statusConfig[status as OrderStatus]?.label || status; }
  getStatusSeverity(status: any): SeverityType { return this.statusConfig[status as OrderStatus]?.severity || 'info'; }
}