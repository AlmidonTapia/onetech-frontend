import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { Brand } from '../../../../../core/domains/catalog/models/brand.model';
import { inject } from '@angular/core';
import { TranslationService as AppTranslationService } from '../../../../../core/services/translation.service';

@Component({
  selector: 'app-brands-table',
  standalone: true,
  imports: [TableModule, TooltipModule, InputTextModule],
  templateUrl: './brands-table.html',
  styleUrl: './brands-table.css'
})
export class BrandsTableComponent {
  @Input() brands: Brand[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() searchQuery = '';
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() editItem = new EventEmitter<Brand>();
  @Output() deleteItem = new EventEmitter<Brand>();
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
    actionsWidth: '100px',
    colspanEmpty: 2
  };

  get content() {
    return {
      quickSearchTitle: this.t().adminBrands.table.quickSearchTitle,
      searchPlaceholder: this.t().adminBrands.table.searchPlaceholder,
      headers: {
        brand: this.t().adminBrands.table.headers.brand,
        actions: this.t().adminBrands.table.headers.actions
      },
      tooltips: {
        edit: this.t().adminBrands.table.tooltips.edit,
        delete: this.t().adminBrands.table.tooltips.delete
      },
      emptyMessage: this.t().adminBrands.table.emptyMessage,
      icons: {
        edit: 'pi pi-pencil',
        delete: 'pi pi-trash'
      }
    };
  }
}
