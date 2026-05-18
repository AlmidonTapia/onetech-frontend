import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DatePipe, CurrencyPipe, TitleCasePipe, LowerCasePipe, SlicePipe } from '@angular/common';
import { Shipment } from '../../../../../core/models/shipment.model';

@Component({
  selector: 'app-shipments-table',
  standalone: true,
  imports: [TableModule, TooltipModule, DatePipe, CurrencyPipe, TitleCasePipe, LowerCasePipe, SlicePipe],
  templateUrl: './shipments-table.html',
  styleUrl: './shipments-table.css'
})
export class ShipmentsTableComponent {
  @Input() shipments: Shipment[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() editItem = new EventEmitter<Shipment>();

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
}
