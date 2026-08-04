import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

export interface SortOption { label: string; value: string; }

@Component({
  selector: 'app-catalog-sort',
  standalone: true,
  imports: [FormsModule, SelectModule],
  templateUrl: './catalog-sort.html'
})
export class CatalogSortComponent {
  @Input() totalRecords = 0;
  @Input() sort = 'relevance';
  @Output() sortChange = new EventEmitter<string>();
  get options(): SortOption[] {
    return [
      { label: 'Relevancia', value: 'relevance' },
      { label: 'Precio: menor a mayor', value: 'price_asc' },
      { label: 'Precio: mayor a menor', value: 'price_desc' },
      { label: 'Nombre A-Z', value: 'name_asc' },
      { label: 'Más nuevos primero', value: 'newest' },
    ];
  }
}
