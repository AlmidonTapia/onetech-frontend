import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProductsTableComponent } from './components/products-table/products-table';
import { ProductFormComponent } from './components/product-form/product-form';
import { ProductImagesManagerComponent } from './components/product-images-manager/product-images-manager';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { CardComponent } from '../../../shared/components/ui/card/card';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { BrandService } from '../../../core/services/brand.service';
import { Product, CreateProductRequest } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { Brand } from '../../../core/models/brand.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, InputTextModule, ProductsTableComponent, ProductFormComponent,
    ProductImagesManagerComponent, ButtonComponent, CardComponent],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);

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

  ngOnInit() {
    this.categoryService.getAll(0, 100).subscribe(r => this.categories.set(r.content));
    this.brandService.getAll(0, 100).subscribe(r => this.brands.set(r.content));
    this.loadProducts();
  }

  loadProducts(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.productService.getAll({ page, size: 10, search: this.search || undefined }).subscribe({
      next: r => { this.products.set(r.content); this.totalRecords.set(r.totalElements); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openCreate() { this.editingProduct.set(null); this.formVisible.set(true); }
  openEdit(p: Product) { this.editingProduct.set(p); this.formVisible.set(true); }
  openImages(p: Product) { this.editingProduct.set(p); this.imagesVisible.set(true); }

  onSave(data: CreateProductRequest) {
    this.saving.set(true);
    const op = this.editingProduct()
      ? this.productService.update(this.editingProduct()!.id, data)
      : this.productService.create(data);
    op.subscribe({
      next: () => {
        this.alertService.success(this.editingProduct() ? 'Producto actualizado' : 'Producto creado');
        this.formVisible.set(false); this.saving.set(false); this.loadProducts();
      },
      error: () => { this.alertService.error('Error al guardar'); this.saving.set(false); }
    });
  }

  onDelete(p: Product) {
    this.modalService.open({
      title: '¿Eliminar producto?',
      message: `"${p.productName}" será eliminado permanentemente.`,
      severity: 'danger', confirmLabel: 'Sí, eliminar',
      onConfirm: () => this.productService.delete(p.id).subscribe({
        next: () => { this.alertService.success('Producto eliminado'); this.loadProducts(); },
        error: () => this.alertService.error('Error al eliminar'),
      }),
    });
  }
}