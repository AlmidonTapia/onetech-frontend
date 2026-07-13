import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { DatePipe, CurrencyPipe, SlicePipe } from '@angular/common';
import { Shipment, ShipmentStatus } from '../../../../../core/domains/shipping/models/shipment.model';

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
    colspanEmpty: 8,
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
      shippedAt: 'Fecha Envío',
      arrival: 'Llegada Estimada',
      status: 'Estado',
      actions: 'Acciones'
    },
    emptyMessage: 'No hay envíos registrados.',
    dateFormat: 'mediumDate',
    datetimeFormat: 'medium'
  };

  readonly statusConfig: Record<ShipmentStatus, { label: string; class: string; icon: string; tooltip: string }> = {
    EN_PREPARACION: { label: 'En Preparación', class: 'en-preparacion', icon: 'pi pi-send', tooltip: 'Despachar Envío' },
    EN_CAMINO: { label: 'En Camino', class: 'en-camino', icon: 'pi pi-check-square', tooltip: 'Gestionar Entrega' },
    ENTREGADO: { label: 'Entregado', class: 'entregado', icon: 'pi pi-eye', tooltip: 'Ver Detalles' },
    DEVOLUCION_PENDIENTE: { label: 'Dev. Pendiente', class: 'devolucion-pendiente', icon: 'pi pi-truck', tooltip: 'Recibir en Almacén' },
    DEVUELTO: { label: 'Devuelto', class: 'devuelto', icon: 'pi pi-eye', tooltip: 'Ver Detalles' },
  };

  getStatusLabel(status: ShipmentStatus): string {
    return this.statusConfig[status]?.label || status;
  }

  getStatusClass(status: ShipmentStatus): string {
    return this.statusConfig[status]?.class || '';
  }

  getActionIcon(status: ShipmentStatus): string {
    return this.statusConfig[status]?.icon || 'pi pi-pencil';
  }

  getActionTooltip(status: ShipmentStatus): string {
    return this.statusConfig[status]?.tooltip || 'Gestionar';
  }
}
