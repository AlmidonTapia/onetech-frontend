import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { CatalogFiltersComponent, CatalogFilterValues } from './components/catalog-filters/catalog-filters';
import { CatalogGridComponent }  from './components/catalog-grid/catalog-grid';
import { CatalogSortComponent }  from './components/catalog-sort/catalog-sort';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/ui/breadcrumb/breadcrumb';
import { ProductService } from '../../../core/domains/catalog/services/product.service';
import { Product } from '../../../core/domains/catalog/models/product.model';
import { SeoService } from '../../../core/domains/shared/services/seo.service';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, InputTextModule, PaginatorModule,
            CatalogFiltersComponent, CatalogGridComponent, CatalogSortComponent,
            BreadcrumbComponent],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private seoService     = inject(SeoService);
  ts = inject(TranslationService);
  t = this.ts.t;

  products     = signal<Product[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  showMobileFilters = false;

  toggleMobileFilters() {
    this.showMobileFilters = !this.showMobileFilters;
  }

  page         = signal(0);
  rows         = 12;
  sort         = signal('relevance');
  search       = signal('');

  filters = signal<CatalogFilterValues>({});

  breadcrumb: BreadcrumbItem[] = [{ label: this.t().catalog.breadcrumbLabel }];

  ngOnInit() {
    this.seoService.setMetaData({
      title: this.t().catalog.seoTitle,
      description: this.t().catalog.seoDescription
    });

    this.route.queryParams.subscribe(p => {
      this.search.set(p['search'] ?? '');
      this.filters.update(f => ({
        ...f,
        categoryId: p['category'] ?? undefined,
        brandId: p['brand'] ?? undefined,
        minPrice: p['minPrice'] ? Number(p['minPrice']) : undefined,
        maxPrice: p['maxPrice'] ? Number(p['maxPrice']) : undefined
      }));
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading.set(true);
    const f = this.filters();
    this.productService.getAll({
      page: this.page(), size: this.rows,
      search: this.search() || undefined,
      idCategory: f.categoryId,
      idBrand: f.brandId,
      minPrice: f.minPrice,
      maxPrice: f.maxPrice,
      sort: this.sort()
    }).subscribe({
      next: r => { this.products.set(r.content); this.totalRecords.set(r.totalElements); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onFiltersApply(newFilters: CatalogFilterValues) {
    this.page.set(0);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: newFilters.categoryId || null,
        brand: newFilters.brandId || null,
        minPrice: newFilters.minPrice !== undefined && newFilters.minPrice !== null ? newFilters.minPrice : null,
        maxPrice: newFilters.maxPrice !== undefined && newFilters.maxPrice !== null ? newFilters.maxPrice : null
      },
      queryParamsHandling: 'merge'
    });
  }

  onSortChange(sort: string) {
    this.sort.set(sort);
    this.loadProducts();
  }

  onPageChange(e: any) {
    this.page.set(e.page);
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}