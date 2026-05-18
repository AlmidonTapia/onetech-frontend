import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { BadgeComponent } from '../../../../../shared/components/ui/badge/badge';
import { InventoryMovement } from '../../../../../core/models/inventory.model';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [TableModule, BadgeComponent, DatePipe],
  templateUrl: './inventory-table.html',
  styleUrl: './inventory-table.css'
})
export class InventoryTableComponent {
  @Input() movements: InventoryMovement[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() lazyLoad = new EventEmitter<any>();

  tableConfig = {
    defaultRows: 10,
    styleClass: 'p-datatable-sm',
    tableMinWidth: '700px',
    colspanEmpty: 5,
    typeIn: 'IN',
    badgeSuccess: 'success' as const,
    badgeError: 'error' as const
  } as const;

  content = {
    headers: {
      product: 'Producto',
      type: 'Tipo',
      quantity: 'Cantidad',
      reason: 'Motivo',
      date: 'Fecha'
    },
    labels: {
      inText: 'Entrada',
      outText: 'Salida',
      inSign: '+',
      outSign: '-'
    },
    icons: {
      inIcon: 'pi pi-arrow-up',
      outIcon: 'pi pi-arrow-down'
    },
    emptyMessage: 'No hay movimientos registrados.',
    dateFormat: 'dd/MM/yyyy HH:mm'
  };
}
