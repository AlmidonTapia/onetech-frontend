import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { Brand } from '../../../../../core/domains/catalog/models/brand.model';
import { inject } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-brands-table',
  standalone: true,
  imports: [TableModule, TooltipModule, InputTextModule, ButtonComponent],
  templateUrl: './brands-table.html'
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
      quickSearchTitle: 'Búsqueda Rápida',
      searchPlaceholder: 'Buscar marcas...',
      headers: {
        brand: 'Marca',
        actions: 'Acciones'
      },
      tooltips: {
        edit: 'Editar',
        delete: 'Eliminar'
      },
      emptyMessage: 'No hay marcas registradas.',
      icons: {
        edit: 'pi pi-pencil',
        delete: 'pi pi-trash'
      }
    };
  }
}
