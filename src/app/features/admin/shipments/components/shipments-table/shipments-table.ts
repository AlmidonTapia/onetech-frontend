import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { DatePipe, CurrencyPipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { Shipment, ShipmentStatus } from '../../../../../core/domains/shipping/models/shipment.model';
import { inject } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-shipments-table',
  standalone: true,
  imports: [TableModule, TooltipModule, DatePipe, InputTextModule, SelectModule, FormsModule, ButtonComponent, CurrencyPipe, SlicePipe],
  templateUrl: './shipments-table.html'
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

  get content() {
    return {
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
  }

  get statusConfig(): Record<ShipmentStatus, { label: string; class: string; icon: string; tooltip: string }> {
    return {
      EN_PREPARACION: { label: 'En Preparación', class: 'bg-slate-50 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700', icon: 'pi pi-send', tooltip: 'Despachar Envío' },
      EN_CAMINO: { label: 'En Camino', class: 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400', icon: 'pi pi-check-square', tooltip: 'Gestionar Entrega' },
      ENTREGADO: { label: 'Entregado', class: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400', icon: 'pi pi-eye', tooltip: 'Ver Detalles' },
      DEVOLUCION_PENDIENTE: { label: 'Dev. Pendiente', class: 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400', icon: 'pi pi-truck', tooltip: 'Recibir en Almacén' },
      DEVUELTO: { label: 'Devuelto', class: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400', icon: 'pi pi-eye', tooltip: 'Ver Detalles' },
    };
  }

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
