import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

export interface CategoryNode {
  parent: Category;
  children: Category[];
  isOpen: boolean;
}

@Component({
  selector: 'app-catalog-filters',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  templateUrl: './catalog-filters.html'
})
export class CatalogFiltersComponent implements OnInit, OnChanges {
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);
  private destroyRef = inject(DestroyRef);

  @Input() filters: CatalogFilterValues = {};
  @Output() filtersChange = new EventEmitter<CatalogFilterValues>();
  @Output() apply = new EventEmitter<CatalogFilterValues>();

  categoryTree: CategoryNode[] = [];
  brands: Brand[] = [];
  localFilters: CatalogFilterValues = {};

  apiConfig = {
    categoryPage: 0,
    categorySize: 100,
    brandPage: 0,
    brandSize: 100
  };

  isCategoryOpen = true;
  isBrandOpen = true;
  isPriceOpen = true;
  ngOnInit() {
    this.localFilters = { ...this.filters };

    this.categoryService
      .getAll(this.apiConfig.categoryPage, this.apiConfig.categorySize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(r => {
        const allCats = r.content;
        const roots = allCats.filter(c => !c.parentIdCategory);
        this.categoryTree = roots.map(root => ({
          parent: root,
          children: allCats.filter(c => c.parentIdCategory === root.idCategory),
          isOpen: false
        }));
        this.openActiveCategory();
      });

    this.brandService
      .getAll(this.apiConfig.brandPage, this.apiConfig.brandSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(r => this.brands = r.content);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters']) {
      this.localFilters = { ...this.filters };
      this.openActiveCategory();
    }
  }

  private openActiveCategory() {
    if (this.localFilters.categoryId && this.categoryTree.length > 0) {
      const activeNode = this.categoryTree.find(node =>
        node.parent.idCategory === this.localFilters.categoryId ||
        node.children.some(c => c.idCategory === this.localFilters.categoryId)
      );
      if (activeNode) {
        activeNode.isOpen = true;
      }
    }
  }

  toggleCategoryNode(node: CategoryNode, event: Event) {
    event.stopPropagation();
    node.isOpen = !node.isOpen;
  }

  onApply() {
    const cleanedFilters = { ...this.localFilters };
    if (cleanedFilters.categoryId === 'undefined' || cleanedFilters.categoryId === 'null') cleanedFilters.categoryId = undefined;
    if (cleanedFilters.brandId === 'undefined' || cleanedFilters.brandId === 'null') cleanedFilters.brandId = undefined;
    if (cleanedFilters.minPrice === null || cleanedFilters.minPrice === undefined || String(cleanedFilters.minPrice) === '') cleanedFilters.minPrice = undefined;
    if (cleanedFilters.maxPrice === null || cleanedFilters.maxPrice === undefined || String(cleanedFilters.maxPrice) === '') cleanedFilters.maxPrice = undefined;
    this.apply.emit(cleanedFilters);
  }

  onReset() {
    this.localFilters = {};
    this.apply.emit({ ...this.localFilters });
  }
}
