import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Coupon } from '../../../../../core/models/coupon.model';

@Component({
  selector: 'app-coupons-table',
  standalone: true,
  imports: [TableModule, TooltipModule, DatePipe],
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

  tableConfig = {
    styleClass: 'p-datatable-sm',
    tableMinWidth: '860px',
    colspanEmpty: 8
  } as const;

  content = {
    headers: {
      code: 'Código',
      discountType: 'Tipo',
      discountValue: 'Valor',
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
