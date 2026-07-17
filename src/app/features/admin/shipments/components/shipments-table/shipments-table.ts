import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { DatePipe, CurrencyPipe, SlicePipe } from '@angular/common';
import { Shipment, ShipmentStatus } from '../../../../../core/domains/shipping/models/shipment.model';
import { inject } from '@angular/core';
import { TranslationService as AppTranslationService } from '../../../../../core/services/translation.service';

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

  ts = inject(AppTranslationService);
  t = this.ts.t;

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
      quickSearchTitle: this.t().adminShipments.table.quickSearchTitle,
      searchPlaceholder: this.t().adminShipments.table.searchPlaceholder,
      headers: {
        orderId: this.t().adminShipments.table.headers.orderId,
        method: this.t().adminShipments.table.headers.method,
        tracking: this.t().adminShipments.table.headers.tracking,
        cost: this.t().adminShipments.table.headers.cost,
        shippedAt: this.t().adminShipments.table.headers.shippedAt,
        arrival: this.t().adminShipments.table.headers.arrival,
        status: this.t().adminShipments.table.headers.status,
        actions: this.t().adminShipments.table.headers.actions
      },
      emptyMessage: this.t().adminShipments.table.emptyMessage,
      dateFormat: 'mediumDate',
      datetimeFormat: 'medium'
    };
  }

  get statusConfig(): Record<ShipmentStatus, { label: string; class: string; icon: string; tooltip: string }> {
    return {
      EN_PREPARACION: { label: this.t().adminShipments.form.statusConfig.inPreparation.label, class: 'en-preparacion', icon: 'pi pi-send', tooltip: this.t().adminShipments.form.statusConfig.inPreparation.tooltip },
      EN_CAMINO: { label: this.t().adminShipments.form.statusConfig.onTheWay.label, class: 'en-camino', icon: 'pi pi-check-square', tooltip: this.t().adminShipments.form.statusConfig.onTheWay.tooltip },
      ENTREGADO: { label: this.t().adminShipments.form.statusConfig.delivered.label, class: 'entregado', icon: 'pi pi-eye', tooltip: this.t().adminShipments.form.statusConfig.delivered.tooltip },
      DEVOLUCION_PENDIENTE: { label: this.t().adminShipments.form.statusConfig.pendingReturn.label, class: 'devolucion-pendiente', icon: 'pi pi-truck', tooltip: this.t().adminShipments.form.statusConfig.pendingReturn.tooltip },
      DEVUELTO: { label: this.t().adminShipments.form.statusConfig.returned.label, class: 'devuelto', icon: 'pi pi-eye', tooltip: this.t().adminShipments.form.statusConfig.returned.tooltip },
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
