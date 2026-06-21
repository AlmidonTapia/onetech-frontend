import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Coupon } from '../../../../../core/models/coupon.model';

@Component({
  selector: 'app-coupons-table',
  standalone: true,
  imports: [TableModule, TooltipModule, DatePipe, InputTextModule, SelectModule, FormsModule],
  templateUrl: './coupons-table.html',
  styleUrl: './coupons-table.css'
})
export class CouponsTableComponent {
  @Input() coupons: Coupon[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() rows = 10;
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() editItem = new EventEmitter<Coupon>();
  @Output() deleteItem = new EventEmitter<Coupon>();
  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ type: string, status: string }>();

  typeOptions = [
    { label: 'Todos los tipos', value: 'ALL' },
    { label: 'Porcentaje', value: 'PORCENTUAL' },
    { label: 'Fijo', value: 'FIJO' }
  ];

  statusOptions = [
    { label: 'Todos los estados', value: 'ALL' },
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' }
  ];

  selectedType = 'ALL';
  selectedStatus = 'ALL';

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value);
  }

  onFilter() {
    this.filterChange.emit({ type: this.selectedType, status: this.selectedStatus });
  }

  tableConfig = {
    defaultRows: 10,
    styleClass: 'p-datatable-sm',
    tableMinWidth: '860px',
    colspanEmpty: 9
  } as const;

  content = {
    quickSearchTitle: 'Búsqueda Rápida',
    searchPlaceholder: 'Código del cupón...',
    headers: {
      code: 'Código',
      discountType: 'Tipo',
      discountValue: 'Valor',
      startDate: 'Inicio',
      expirationDate: 'Expiración',
      usageLimit: 'Límite de Uso',
      usedCount: 'Usado',
      active: 'Activo',
      actions: 'Acciones'
    },
    tooltips: {
      edit: 'Editar',
      delete: 'Eliminar'
    },
    emptyMessage: 'No se encontraron cupones.',
    icons: {
      edit: 'pi pi-pencil',
      delete: 'pi pi-trash'
    }
  };
}
