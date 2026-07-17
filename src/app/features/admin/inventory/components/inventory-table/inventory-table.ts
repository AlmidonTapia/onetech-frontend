import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeComponent } from '../../../../../shared/components/ui/badge/badge';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { InventoryMovement } from '../../../../../core/domains/inventory/models/inventory.model';
import { TranslationService as AppTranslationService } from '../../../../../core/services/translation.service';
import { inject } from '@angular/core';

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

  ts = inject(AppTranslationService);
  t = this.ts.t;

  get typeOptions() {
    return [
      { label: this.t().adminInventory.table.types.all, value: 'ALL' },
      { label: this.t().adminInventory.table.types.in, value: 'IN' },
      { label: this.t().adminInventory.table.types.out, value: 'OUT' }
    ];
  }

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

  get content() {
    return {
      quickSearchTitle: this.t().adminInventory.table.quickSearchTitle,
      searchPlaceholder: this.t().adminInventory.table.searchPlaceholder,
      headers: {
        product: this.t().adminInventory.table.headers.product,
        type: this.t().adminInventory.table.headers.type,
        quantity: this.t().adminInventory.table.headers.quantity,
        reason: this.t().adminInventory.table.headers.reason,
        date: this.t().adminInventory.table.headers.date,
        status: this.t().adminInventory.table.headers.status,
        actions: this.t().adminInventory.table.headers.actions
      },
      labels: {
        inText: this.t().adminInventory.table.labels.inText,
        outText: this.t().adminInventory.table.labels.outText,
        inSign: '+',
        outSign: '-',
        enabledText: this.t().adminInventory.table.labels.enabledText,
        canceledText: this.t().adminInventory.table.labels.canceledText
      },
      icons: {
        inIcon: 'pi pi-arrow-up',
        outIcon: 'pi pi-arrow-down'
      },
      emptyMessage: this.t().adminInventory.table.emptyMessage,
      dateFormat: 'dd/MM/yyyy HH:mm'
    };
  }
}
