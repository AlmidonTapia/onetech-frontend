import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../../../shared/components/ui/badge/badge';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { Product } from '../../../../../core/domains/catalog/models/product.model';
import { Category } from '../../../../../core/domains/catalog/models/category.model';
import { Brand } from '../../../../../core/domains/catalog/models/brand.model';
import { inject } from '@angular/core';
import { TranslationService as AppTranslationService } from '../../../../../core/services/translation.service';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [TableModule, TooltipModule, BadgeComponent, CurrencyPenPipe, InputTextModule, SelectModule, FormsModule],
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
  @Input() categories: Category[] = [];
  @Input() brands: Brand[] = [];
  
  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ category: string, brand: string, status: string }>();

  ts = inject(AppTranslationService);
  t = this.ts.t;

  get statusOptions() {
    return [
      { label: this.t().adminProducts.table.allStatuses, value: 'ALL' },
      { label: this.t().adminProducts.table.status.active, value: 'ACTIVO' },
      { label: this.t().adminProducts.table.status.inactive, value: 'INACTIVO' }
    ];
  }

  selectedCategory = 'ALL';
  selectedBrand = 'ALL';
  selectedStatus = 'ALL';

  get categoryOptions() {
    return [
      { label: this.t().adminProducts.table.allCategories, idCategory: 'ALL' }, 
      ...this.categories.map(c => ({ label: c.categoryName, idCategory: c.idCategory }))
    ];
  }

  get brandOptions() {
    return [
      { label: this.t().adminProducts.table.allBrands, idBrand: 'ALL' }, 
      ...this.brands.map(b => ({ label: b.brandName, idBrand: b.idBrand }))
    ];
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.search.emit(target.value);
  }

  onFilter() {
    this.filterChange.emit({
      category: this.selectedCategory,
      brand: this.selectedBrand,
      status: this.selectedStatus
    });
  }

  tableConfig = {
    styleClass: 'p-datatable-sm',
    tableMinWidth: '860px',
    colspanEmpty: 9,
    badgeSuccess: 'success' as const,
    badgeError: 'error' as const
  } as const;

  get content() {
    return {
      quickSearchTitle: this.t().adminProducts.table.quickSearchTitle,
      searchPlaceholder: this.t().adminProducts.table.searchPlaceholder,
      headers: {
        img: this.t().adminProducts.table.headers.img,
        product: this.t().adminProducts.table.headers.product,
        sku: this.t().adminProducts.table.headers.sku,
        category: this.t().adminProducts.table.headers.category,
        brand: this.t().adminProducts.table.headers.brand,
        price: this.t().adminProducts.table.headers.price,
        stock: this.t().adminProducts.table.headers.stock,
        status: this.t().adminProducts.table.headers.status,
        actions: this.t().adminProducts.table.headers.actions
      },
      tooltips: {
        images: this.t().adminProducts.table.tooltips.images,
        edit: this.t().adminProducts.table.tooltips.edit,
        delete: this.t().adminProducts.table.tooltips.delete
      },
      emptyMessage: this.t().adminProducts.table.emptyMessage,
      icons: {
        images: 'pi pi-image',
        edit: 'pi pi-pencil',
        delete: 'pi pi-trash',
        deleteLabel: this.t().adminProducts.table.deleteLabel
      },
      statusLabels: {
        active: this.t().adminProducts.table.status.active,
        inactive: this.t().adminProducts.table.status.inactive,
        outOfStock: this.t().adminProducts.table.status.outOfStock
      }
    };
  }
}
