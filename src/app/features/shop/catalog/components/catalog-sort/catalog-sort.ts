import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TranslationService } from '../../../../../core/services/translation.service';

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

  ts = inject(TranslationService);
  t = this.ts.t;

  get options(): SortOption[] {
    return [
      { label: this.t().catalog.sort.options.relevance, value: 'relevance' },
      { label: this.t().catalog.sort.options.price_asc, value: 'price_asc' },
      { label: this.t().catalog.sort.options.price_desc, value: 'price_desc' },
      { label: this.t().catalog.sort.options.name_asc, value: 'name_asc' },
      { label: this.t().catalog.sort.options.newest, value: 'newest' },
    ];
  }
}
