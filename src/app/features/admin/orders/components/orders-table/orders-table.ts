import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { Order, OrderStatus } from '../../../../../core/domains/checkout/models/order.model';
import { inject } from '@angular/core';
import { TranslationService as AppTranslationService } from '../../../../../core/services/translation.service';

type SeverityType = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [TableModule, TagModule, TooltipModule, CurrencyPenPipe, DatePipe, InputTextModule, SelectModule, FormsModule],
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
  @Output() search = new EventEmitter<string>();
  @Output() filterStatus = new EventEmitter<string>();

  ts = inject(AppTranslationService);
  t = this.ts.t;

  get statusOptions() {
    return [
      { label: this.t().adminOrders.table.allStatuses, value: 'ALL' },
      { label: this.t().orders.status.PENDIENTE, value: 'PENDIENTE' },
      { label: this.t().orders.status.PAGADO, value: 'PAGADO' },
      { label: this.t().orders.status.ENVIADO, value: 'ENVIADO' },
      { label: this.t().orders.status.COMPLETADO, value: 'COMPLETADO' },
      { label: this.t().orders.status.CANCELADO, value: 'CANCELADO' }
    ];
  }

  selectedStatus = 'ALL';

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value);
  }

  onFilterStatus() {
    this.filterStatus.emit(this.selectedStatus);
  }

  tableConfig = {
    defaultRows: 10,
    styleClass: 'p-datatable-sm',
    tableMinWidth: '820px',
    colspanEmpty: 6
  } as const;

  get content() {
    return {
      quickSearchTitle: this.t().adminOrders.table.quickSearchTitle,
      searchPlaceholder: this.t().adminOrders.table.searchPlaceholder,
      idPrefix: '#',
      dateFormat: 'dd/MM/yyyy HH:mm',
      emptyMessage: this.t().adminOrders.table.emptyMessage,
      headers: {
        orderId: this.t().adminOrders.table.headers.orderId,
        client: this.t().adminOrders.table.headers.client,
        date: this.t().adminOrders.table.headers.date,
        total: this.t().adminOrders.table.headers.total,
        status: this.t().adminOrders.table.headers.status,
        actions: this.t().adminOrders.table.headers.actions
      },
      tooltips: {
        viewDetail: this.t().adminOrders.table.tooltips.viewDetail,
        changeStatus: this.t().adminOrders.table.tooltips.changeStatus,
        automatedStatus: this.t().adminOrders.table.tooltips.automatedStatus
      },
      icons: {
        viewDetail: 'pi pi-eye',
        changeStatus: 'pi pi-sync'
      }
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
