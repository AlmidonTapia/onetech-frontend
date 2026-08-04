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
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [TableModule, TooltipModule, BadgeComponent, CurrencyPenPipe, InputTextModule, SelectModule, FormsModule],
  templateUrl: './products-table.html'
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
  get statusOptions() {
    return [
      { label: 'Todos los estados', value: 'ALL' },
      { label: 'Activo', value: 'ACTIVO' },
      { label: 'Inactivo', value: 'INACTIVO' }
    ];
  }

  selectedCategory = 'ALL';
  selectedBrand = 'ALL';
  selectedStatus = 'ALL';

  get categoryOptions() {
    return [
      { label: 'Todas las categorías', idCategory: 'ALL' }, 
      ...this.categories.map(c => ({ label: c.categoryName, idCategory: c.idCategory }))
    ];
  }

  get brandOptions() {
    return [
      { label: 'Todas las marcas', idBrand: 'ALL' }, 
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
      quickSearchTitle: 'Catálogo de Productos',
      searchPlaceholder: 'Buscar producto...',
      headers: {
        img: 'Img',
        product: 'Producto',
        sku: 'SKU',
        category: 'Categoría',
        brand: 'Marca',
        price: 'Precio',
        stock: 'Stock',
        status: 'Estado',
        actions: 'Acciones'
      },
      tooltips: {
        images: 'Imágenes',
        edit: 'Editar',
        delete: 'Eliminar'
      },
      emptyMessage: 'No se encontraron productos.',
      icons: {
        images: 'pi pi-image',
        edit: 'pi pi-pencil',
        delete: 'pi pi-trash',
        deleteLabel: 'Eliminar'
      },
      statusLabels: {
        active: 'Activo',
        inactive: 'Inactivo',
        outOfStock: 'Agotado'
      }
    };
  }
}
