import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeComponent } from '../../../../../shared/components/ui/badge/badge';
import { Category } from '../../../../../core/models/category.model';

@Component({
  selector: 'app-categories-table',
  standalone: true,
  imports: [TableModule, TooltipModule, BadgeComponent],
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
}