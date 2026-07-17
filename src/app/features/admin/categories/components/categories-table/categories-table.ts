import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeComponent } from '../../../../../shared/components/ui/badge/badge';
import { Category } from '../../../../../core/domains/catalog/models/category.model';
import { inject } from '@angular/core';
import { TranslationService as AppTranslationService } from '../../../../../core/services/translation.service';

@Component({
  selector: 'app-categories-table',
  standalone: true,
  imports: [TableModule, TooltipModule, InputTextModule, BadgeComponent],
  templateUrl: './categories-table.html',
  styleUrl: './categories-table.css'
})
export class CategoriesTableComponent {
  @Input() categories: Category[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() editItem = new EventEmitter<Category>();
  @Output() deleteItem = new EventEmitter<Category>();
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
    colspanEmpty: 3
  } as const;

  get content() {
    return {
      quickSearchTitle: this.t().adminCategories.table.quickSearchTitle,
      searchPlaceholder: this.t().adminCategories.table.searchPlaceholder,
      headers: {
        name: this.t().adminCategories.table.headers.name,
        parent: this.t().adminCategories.table.headers.parent,
        actions: this.t().adminCategories.table.headers.actions
      },
      rootCategoryLabel: this.t().adminCategories.table.rootCategoryLabel,
      tooltips: {
        edit: this.t().adminCategories.table.tooltips.edit,
        delete: this.t().adminCategories.table.tooltips.delete
      },
      emptyMessage: this.t().adminCategories.table.emptyMessage,
      icons: {
        edit: 'pi pi-pencil',
        delete: 'pi pi-trash'
      }
    };
  }
}
