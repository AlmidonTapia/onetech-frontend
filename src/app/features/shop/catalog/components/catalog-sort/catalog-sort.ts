import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

export interface SortOption { label: string; value: string; }

@Component({
  selector: 'app-catalog-sort',
  standalone: true,
  imports: [FormsModule, SelectModule],
  templateUrl: './catalog-sort.html',
  styleUrl: './catalog-sort.css'
})
export class CatalogSortComponent {
  @Input() totalRecords = 0;
  @Input() sort = 'relevance';
  @Output() sortChange = new EventEmitter<string>();

  content = {
    resultsSuffix: 'productos encontrados',
    sortLabelText: 'Ordenar por:',
    selectWidth: '220px'
  };

  options: SortOption[] = [
    { label: 'Relevancia', value: 'relevance' },
    { label: 'Precio: menor a mayor', value: 'price_asc' },
    { label: 'Precio: mayor a menor', value: 'price_desc' },
    { label: 'Nombre A-Z', value: 'name_asc' },
    { label: 'Más nuevos primero', value: 'newest' },
  ];
}
