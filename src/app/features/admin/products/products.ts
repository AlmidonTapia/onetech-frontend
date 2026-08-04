import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProductsTableComponent } from './components/products-table/products-table';
import { ProductFormComponent } from './components/product-form/product-form';
import { ProductImagesManagerComponent } from './components/product-images-manager/product-images-manager';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { ProductService } from '../../../core/domains/catalog/services/product.service';
import { CategoryService } from '../../../core/domains/catalog/services/category.service';
import { BrandService } from '../../../core/domains/catalog/services/brand.service';
import { Product, CreateProductRequest, UpdateProductRequest } from '../../../core/domains/catalog/models/product.model';
import { Category } from '../../../core/domains/catalog/models/category.model';
import { Brand } from '../../../core/domains/catalog/models/brand.model';
import { handleFormError } from '../../../shared/utils/form-error.util';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, InputTextModule, ProductsTableComponent, ProductFormComponent,
    ProductImagesManagerComponent, ButtonComponent],
  templateUrl: './products.html'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private destroyRef = inject(DestroyRef);
  @ViewChild(ProductFormComponent) productForm!: ProductFormComponent;

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  imagesVisible = signal(false);
  editingProduct = signal<Product | null>(null);
  search = '';
  searchSubject = new Subject<string>();
  filterCategory = signal<string | undefined>(undefined);
  filterBrand = signal<string | undefined>(undefined);
  filterStatus = signal<string | undefined>(undefined);

  apiConfig = {
    pageSize: 10,
    lookupPage: 0,
    lookupSize: 100
  };

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(term => {
      this.search = term;
      this.loadProducts({ first: 0, rows: this.apiConfig.pageSize });
    });

    this.categoryService.getAll(this.apiConfig.lookupPage, this.apiConfig.lookupSize).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(r => this.categories.set(r.content));
    this.brandService.getAll(this.apiConfig.lookupPage, this.apiConfig.lookupSize).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(r => this.brands.set(r.content));
    this.loadProducts();
  }

  loadProducts(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.productService.getAll({ 
      page, 
      size: this.apiConfig.pageSize, 
      search: this.search || undefined,
      idCategory: this.filterCategory(),
      idBrand: this.filterBrand(),
      status: this.filterStatus()
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r => { this.products.set(r.content); this.totalRecords.set(r.totalElements); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  onFilterChange(filters: { category: string, brand: string, status: string }) {
    this.filterCategory.set(filters.category === 'ALL' ? undefined : filters.category);
    this.filterBrand.set(filters.brand === 'ALL' ? undefined : filters.brand);
    this.filterStatus.set(filters.status === 'ALL' ? undefined : filters.status);
    this.loadProducts({ first: 0, rows: this.apiConfig.pageSize });
  }

  openCreate() { this.editingProduct.set(null); this.formVisible.set(true); }
  openEdit(p: Product) { this.editingProduct.set(p); this.formVisible.set(true); }
  openImages(p: Product) { this.editingProduct.set(p); this.imagesVisible.set(true); }

  onSave(data: CreateProductRequest | UpdateProductRequest) {
    this.saving.set(true);
    const isEditing = !!this.editingProduct();
    const op: any = isEditing
      ? this.productService.update(this.editingProduct()!.idProduct, data as UpdateProductRequest)
      : this.productService.create(data as CreateProductRequest);

    op.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success(isEditing ? 'Producto actualizado' : 'Producto creado');
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadProducts();
      },
      error: (err: any) => {
        const errorMsg = handleFormError(err, this.productForm.form) || undefined;
        this.alertService.error('Error al guardar', errorMsg);
        this.saving.set(false);
      }
    });
  }

  onDelete(p: Product) {
    this.modalService.open({
      title: '¿Eliminar producto?',
      message: `"${p.productName}" ${'será eliminado permanentemente.'}`,
      severity: 'danger',
      confirmLabel: 'Sí, eliminar',
      onConfirm: () => this.productService.delete(p.idProduct).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.alertService.success('Producto eliminado');
          this.loadProducts();
        },
        error: () => this.alertService.error('Error al eliminar'),
      }),
    });
  }
}
