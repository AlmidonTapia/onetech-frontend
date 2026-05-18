import { Component, Input, Output, EventEmitter, OnChanges, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Product, CreateProductRequest } from '../../../../../core/models/product.model';
import { Category } from '../../../../../core/models/category.model';
import { Brand } from '../../../../../core/models/brand.model';
import { CategoryService } from '../../../../../core/services/category.service';
import { BrandService } from '../../../../../core/services/brand.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, DialogModule, InputTextModule,
    TextareaModule, SelectModule, InputNumberModule, ButtonComponent
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent implements OnChanges, OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);

  @Input() visible = false;
  @Input() product: Product | null = null;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateProductRequest>();
  @Output() cancel = new EventEmitter<void>();

  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);

  content = {
    dialogWidth: '600px',
    titleNew: 'Nuevo Producto',
    titleEdit: 'Editar Producto',
    errorRequired: 'Campo requerido',
    styles: {
      selectWidth: '100%',
      appendTo: 'body'
    },
    actions: {
      cancelLabel: 'Cancelar',
      saveLabel: 'Guardar',
      saveIcon: 'pi-check'
    }
  } as const;

  formConfig: any[] = [
    [
      { name: 'productName', label: 'Nombre del producto *', type: 'text', placeholder: 'Ej: Laptop Asus ROG' },
      { name: 'sku', label: 'SKU *', type: 'text', placeholder: 'Ej: LAP-ASUS-01' }
    ],
    [
      { name: 'idCategory', label: 'Categoría *', type: 'select', optionsKey: 'categories', optionLabel: 'categoryName', optionValue: 'idCategory', placeholder: 'Seleccionar categoría' },
      { name: 'idBrand', label: 'Marca *', type: 'select', optionsKey: 'brands', optionLabel: 'brandName', optionValue: 'idBrand', placeholder: 'Seleccionar marca' }
    ],
    [
      { name: 'price', label: 'Precio (S/.) *', type: 'number', mode: 'decimal', min: 0, minFractionDigits: 2 },
      { name: 'stockQuantity', label: 'Stock Inicial *', type: 'number', mode: 'decimal', min: 0 }
    ],
    [
      { name: 'description', label: 'Descripción del producto *', type: 'textarea', placeholder: 'Ingresa las especificaciones y características principales...' }
    ]
  ];

  form = this.fb.group({
    productName: ['', [Validators.required, Validators.minLength(3)]],
    sku: ['', Validators.required],
    idCategory: ['', Validators.required],
    idBrand: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required]
  });

  get title() {
    return this.product ? this.content.titleEdit : this.content.titleNew;
  }

  ngOnInit() {
    this.categoryService.getAll(0, 100).subscribe(r => this.categories.set(r.content));
    this.brandService.getAll(0, 100).subscribe(r => this.brands.set(r.content));
  }

  getOptions(key: string) {
    if (key === 'categories') return this.categories();
    if (key === 'brands') return this.brands();
    return [];
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }

  ngOnChanges() {
    if (this.product) {
      this.form.patchValue({
        productName: this.product.productName,
        sku: this.product.sku,
        idCategory: this.product.idCategory,
        idBrand: this.product.idBrand,
        price: this.product.price,
        stockQuantity: this.product.stockQuantity,
        description: this.product.description
      });
    } else {
      this.form.reset({ price: 0, stockQuantity: 0 });
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value as CreateProductRequest);
  }

  onCancel() {
    this.form.reset({ price: 0, stockQuantity: 0 });
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
