import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeComponent } from '../../../../../shared/components/ui/badge/badge';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { Product } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [TableModule, TooltipModule, BadgeComponent, CurrencyPenPipe],
  templateUrl: './products-table.html',
  styleUrl: './products-table.css'
})
export class ProductsTableComponent {
  @Input() products: Product[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() rows = 10;
  @Output() lazyLoad = new EventEmitter<any>();
  @Output() editItem = new EventEmitter<Product>();
  @Output() deleteItem = new EventEmitter<Product>();
  @Output() manageImages = new EventEmitter<Product>();
}