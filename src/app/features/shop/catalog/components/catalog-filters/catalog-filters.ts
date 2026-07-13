import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../../core/domains/catalog/services/category.service';
import { BrandService } from '../../../../../core/domains/catalog/services/brand.service';
import { Category } from '../../../../../core/domains/catalog/models/category.model';
import { Brand } from '../../../../../core/domains/catalog/models/brand.model';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

export interface CatalogFilterValues {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Component({
  selector: 'app-catalog-filters',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  templateUrl: './catalog-filters.html',
  styleUrl: './catalog-filters.css'
})
export class CatalogFiltersComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);

  @Input() filters: CatalogFilterValues = {};
  @Output() filtersChange = new EventEmitter<CatalogFilterValues>();
  @Output() apply = new EventEmitter<CatalogFilterValues>();

  categories: Category[] = [];
  brands: Brand[] = [];
  localFilters: CatalogFilterValues = {};

  apiConfig = {
    categoryPage: 0,
    categorySize: 50,
    brandPage: 0,
    brandSize: 50
  };

  isCategoryOpen = true;
  isBrandOpen = true;
  isPriceOpen = true;


  content = {
    mainTitle: 'Filtros',
    resetBtnText: 'Limpiar',
    categoryTitle: 'Categoría',
    allCategoriesOption: 'Todas',
    brandTitle: 'Marca',
    priceTitle: 'Precio (S/)',
    minPricePlaceholder: 'Mín',
    maxPricePlaceholder: 'Máx',
    applyBtnLabel: 'Aplicar filtros',
    applyBtnIcon: 'pi-filter'
  };

  ngOnInit() {
    this.localFilters = { ...this.filters };

    this.categoryService
      .getAll(this.apiConfig.categoryPage, this.apiConfig.categorySize)
      .subscribe(r => this.categories = r.content);

    this.brandService
      .getAll(this.apiConfig.brandPage, this.apiConfig.brandSize)
      .subscribe(r => this.brands = r.content);
  }



  onApply() {
    this.apply.emit({ ...this.localFilters });
  }

  onReset() {
    this.localFilters = {};
    this.apply.emit({ ...this.localFilters });
  }
}
