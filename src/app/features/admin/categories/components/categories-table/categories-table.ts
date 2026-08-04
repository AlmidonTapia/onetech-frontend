import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeComponent } from '../../../../../shared/components/ui/badge/badge';
import { Category } from '../../../../../core/domains/catalog/models/category.model';
import { inject } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-categories-table',
  standalone: true,
  imports: [TableModule, TooltipModule, InputTextModule, BadgeComponent, ButtonComponent],
  templateUrl: './categories-table.html'
})
export class CategoriesTableComponent {
  @Input() categories: Category[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() editItem = new EventEmitter<Category>();
  @Output() deleteItem = new EventEmitter<Category>();
  @Output() search = new EventEmitter<string>();
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
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'Buscar categorías...',
      headers: {
        name: 'Nombre',
        parent: 'Categoría padre',
        actions: 'Acciones'
      },
      rootCategoryLabel: 'Categoría raíz',
      tooltips: {
        edit: 'Editar',
        delete: 'Eliminar'
      },
      emptyMessage: 'No hay categorías registradas.',
      icons: {
        edit: 'pi pi-pencil',
        delete: 'pi pi-trash'
      }
    };
  }
}
