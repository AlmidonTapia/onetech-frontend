import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeComponent } from '../../../../../shared/components/ui/badge/badge';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { InventoryMovement } from '../../../../../core/domains/inventory/models/inventory.model';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [TableModule, BadgeComponent, ButtonComponent, DatePipe, InputTextModule, SelectModule, FormsModule],
  templateUrl: './inventory-table.html',
  styleUrl: './inventory-table.css'
})
export class InventoryTableComponent {
  @Input() movements: InventoryMovement[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();
  @Output() filterType = new EventEmitter<string>();

  typeOptions = [
    { label: 'Todos los tipos', value: 'ALL' },
    { label: 'Entrada (IN)', value: 'IN' },
    { label: 'Salida (OUT)', value: 'OUT' }
  ];

  selectedType = 'ALL';

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value);
  }

  onFilterType() {
    this.filterType.emit(this.selectedType);
  }

  tableConfig = {
    defaultRows: 10,
    styleClass: 'p-datatable-sm',
    tableMinWidth: '700px',
    colspanEmpty: 7,
    typeIn: 'IN',
    badgeSuccess: 'success' as const,
    badgeError: 'error' as const
  } as const;

  content = {
    quickSearchTitle: 'Búsqueda Rápida',
    searchPlaceholder: 'Buscar en inventario...',
    headers: {
      product: 'Producto',
      type: 'Tipo',
      quantity: 'Cantidad',
      reason: 'Motivo',
      date: 'Fecha',
      status: 'Estado',
      actions: 'Acciones'
    },
    labels: {
      inText: 'Entrada',
      outText: 'Salida',
      inSign: '+',
      outSign: '-',
      enabledText: 'Habilitado',
      canceledText: 'Anulado'
    },
    icons: {
      inIcon: 'pi pi-arrow-up',
      outIcon: 'pi pi-arrow-down'
    },
    emptyMessage: 'No hay movimientos registrados.',
    dateFormat: 'dd/MM/yyyy HH:mm'
  };
}
