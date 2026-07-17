import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Coupon } from '../../../../../core/domains/checkout/models/coupon.model';
import { TranslationService as AppTranslationService } from '../../../../../core/services/translation.service';
import { inject } from '@angular/core';

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

  ts = inject(AppTranslationService);
  t = this.ts.t;

  get typeOptions() {
    return [
      { label: this.t().adminCoupons.table.types.all, value: 'ALL' },
      { label: this.t().adminCoupons.table.types.percentage, value: 'PORCENTUAL' },
      { label: this.t().adminCoupons.table.types.fixed, value: 'FIJO' }
    ];
  }

  get statusOptions() {
    return [
      { label: this.t().adminCoupons.table.statuses.all, value: 'ALL' },
      { label: this.t().adminCoupons.table.statuses.active, value: 'ACTIVO' },
      { label: this.t().adminCoupons.table.statuses.inactive, value: 'INACTIVO' }
    ];
  }

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

  get content() {
    return {
      quickSearchTitle: this.t().adminCoupons.table.quickSearchTitle,
      searchPlaceholder: this.t().adminCoupons.table.searchPlaceholder,
      headers: {
        code: this.t().adminCoupons.table.headers.code,
        discountType: this.t().adminCoupons.table.headers.discountType,
        discountValue: this.t().adminCoupons.table.headers.discountValue,
        startDate: this.t().adminCoupons.table.headers.startDate,
        expirationDate: this.t().adminCoupons.table.headers.expirationDate,
        usageLimit: this.t().adminCoupons.table.headers.usageLimit,
        usedCount: this.t().adminCoupons.table.headers.usedCount,
        active: this.t().adminCoupons.table.headers.active,
        actions: this.t().adminCoupons.table.headers.actions
      },
      tooltips: {
        edit: this.t().adminCoupons.table.tooltips.edit,
        delete: this.t().adminCoupons.table.tooltips.delete
      },
      emptyMessage: this.t().adminCoupons.table.emptyMessage,
      types: {
        percentage: this.t().adminCoupons.table.types.percentage,
        fixedLabel: this.t().adminCoupons.table.types.fixedLabel
      },
      statuses: {
        active: this.t().adminCoupons.table.statuses.active,
        inactive: this.t().adminCoupons.table.statuses.inactive,
        exhausted: this.t().adminCoupons.table.statuses.exhausted,
        expired: this.t().adminCoupons.table.statuses.expired
      },
      values: {
        immediate: this.t().adminCoupons.table.values.immediate,
        noLimit: this.t().adminCoupons.table.values.noLimit
      },
      icons: {
        edit: 'pi pi-pencil',
        delete: 'pi pi-trash'
      }
    };
  }
}
