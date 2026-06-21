import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { DatePipe, CurrencyPipe, SlicePipe } from '@angular/common';
import { Shipment, ShipmentStatus } from '../../../../../core/models/shipment.model';

@Component({
  selector: 'app-shipments-table',
  standalone: true,
  imports: [TableModule, TooltipModule, DatePipe, CurrencyPipe, SlicePipe, InputTextModule],
  templateUrl: './shipments-table.html',
  styleUrl: './shipments-table.css'
})
export class ShipmentsTableComponent {
  @Input() shipments: Shipment[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<Shipment>();
  @Output() search = new EventEmitter<string>();

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value);
  }

  tableConfig = {
    defaultRows: 10,
    styleClass: 'p-datatable-sm',
    actionsWidth: '80px',
    colspanEmpty: 7,
    currencyCode: 'PEN',
    sliceStart: 0,
    sliceEnd: 8
  } as const;

  content = {
    quickSearchTitle: 'Búsqueda Rápida',
    searchPlaceholder: 'Tracking o ID...',
    headers: {
      orderId: 'ID Pedido',
      method: 'Método',
      tracking: 'Tracking',
      cost: 'Costo',
      arrival: 'Llegada Estimada',
      status: 'Estado',
      actions: 'Acciones'
    },
    tooltipEdit: 'Cambiar Estado',
    emptyMessage: 'No hay envíos registrados.',
    dateFormat: 'mediumDate',
    icons: {
      edit: 'pi pi-pencil'
    }
  };

  readonly statusConfig: Record<ShipmentStatus, { label: string; class: string }> = {
    EN_PREPARACION: { label: 'En Preparación', class: 'en-preparacion' },
    EN_CAMINO: { label: 'En Camino', class: 'en-camino' },
    ENTREGADO: { label: 'Entregado', class: 'entregado' },
    DEVUELTO: { label: 'Devuelto', class: 'devuelto' },
  };

  getStatusLabel(status: ShipmentStatus): string {
    return this.statusConfig[status]?.label || status;
  }

  getStatusClass(status: ShipmentStatus): string {
    return this.statusConfig[status]?.class || '';
  }
}
