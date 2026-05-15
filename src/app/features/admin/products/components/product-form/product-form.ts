import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Product, CreateProductRequest } from '../../../../../core/models/product.model';
import { Category } from '../../../../../core/models/category.model';
import { Brand } from '../../../../../core/models/brand.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, InputTextModule,
    InputNumberModule, SelectModule, TextareaModule, ButtonComponent],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible = false;
  @Input() product: Product | null = null;
  @Input() categories: Category[] = [];
  @Input() brands: Brand[] = [];
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateProductRequest>();
  @Output() cancel = new EventEmitter<void>();

  formConfig: any[] = [
    [
      { name: 'productName', label: 'Nombre del producto *', type: 'text', placeholder: 'Ej: Laptop HP Pavilion 15' },
      { name: 'sku', label: 'SKU *', type: 'text', placeholder: 'HP-PAV-15', flex: '0 0 160px' }
    ],
    [
      { name: 'description', label: 'Descripción *', type: 'textarea', placeholder: 'Descripción del producto...' }
    ],
    [
      { name: 'idCategory', label: 'Categoría *', type: 'select', optionsKey: 'categories', optionLabel: 'categoryName', optionValue: 'idCategory', placeholder: 'Seleccionar' },
      { name: 'idBrand', label: 'Marca *', type: 'select', optionsKey: 'brands', optionLabel: 'brandName', optionValue: 'idBrand', placeholder: 'Seleccionar' }
    ],
    [
      { name: 'price', label: 'Precio (S/) *', type: 'number', min: 0, minFractionDigits: 2, mode: 'decimal' },
      { name: 'stockQuantity', label: 'Stock *', type: 'number', min: 0, mode: 'decimal' }
    ]
  ];

  form = this.fb.group({
    productName: ['', [Validators.required, Validators.minLength(3)]],
    sku: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    idCategory: ['', Validators.required],
    idBrand: ['', Validators.required],
  });

  get title() { return this.product ? 'Editar Producto' : 'Nuevo Producto'; }
  get f() { return this.form.controls; }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }

  getOptions(key: string) {
    if (key === 'categories') return this.categories;
    if (key === 'brands') return this.brands;
    return [];
  }

  ngOnChanges() {
    if (this.product) {
      this.form.patchValue({
        productName: this.product.productName, sku: this.product.sku,
        description: this.product.description, price: this.product.price,
        stockQuantity: this.product.stockQuantity,
        idCategory: this.product.idCategory, idBrand: this.product.idBrand,
      });
    } else {
      this.form.reset({ price: 0, stockQuantity: 0 });
    }
  }

  onSave() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.save.emit(this.form.value as CreateProductRequest);
  }

  onCancel() { this.form.reset(); this.cancel.emit(); this.visibleChange.emit(false); }
}