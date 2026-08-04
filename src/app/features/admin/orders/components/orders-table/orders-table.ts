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
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

type SeverityType = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-orders-table',
  standalone: true,
  imports: [TableModule, TagModule, TooltipModule, CurrencyPenPipe, DatePipe, InputTextModule, SelectModule, FormsModule, ButtonComponent],
  templateUrl: './orders-table.html'
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
  get statusOptions() {
    return [
      { label: 'Todos', value: 'ALL' },
      { label: 'Pendiente', value: 'PENDIENTE' },
      { label: 'Pagado', value: 'PAGADO' },
      { label: 'Enviado', value: 'ENVIADO' },
      { label: 'Completado', value: 'COMPLETADO' },
      { label: 'Cancelado', value: 'CANCELADO' }
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
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'ID de Orden, Cliente...',
      idPrefix: '#',
      dateFormat: 'dd/MM/yyyy HH:mm',
      emptyMessage: 'No hay órdenes registradas.',
      headers: {
        orderId: 'ID Orden',
        client: 'Cliente',
        date: 'Fecha',
        total: 'Total',
        status: 'Estado',
        actions: 'Acciones'
      },
      tooltips: {
        viewDetail: 'Ver detalle',
        changeStatus: 'Cambiar estado',
        automatedStatus: 'Estado automatizado por pago/envío'
      },
      icons: {
        viewDetail: 'pi pi-eye',
        changeStatus: 'pi pi-sync'
      }
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
