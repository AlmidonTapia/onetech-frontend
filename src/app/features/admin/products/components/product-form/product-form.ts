import { Component, Input, Output, EventEmitter, OnChanges, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePipe } from '@angular/common';
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
    ReactiveFormsModule, FormsModule, DialogModule, InputTextModule,
    TextareaModule, SelectModule, InputNumberModule, ButtonComponent, DatePipe
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
  @Output() manageImages = new EventEmitter<Product>();

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
    },
    specs: {
      title: 'Especificaciones Técnicas',
      addLabel: 'Añadir Propiedad',
      addIcon: 'pi-plus',
      keyPlaceholder: 'Propiedad (Ej: RAM, Procesador)',
      valuePlaceholder: 'Valor (Ej: 16GB, Intel i7)',
      deleteTitle: 'Eliminar propiedad',
      emptyMessage: 'No hay especificaciones añadidas para este producto.'
    },
    imagesInfo: {
      newProductMsg: 'Podrá subir imágenes una vez que guarde el producto por primera vez.',
      manageBtnLabel: 'Gestionar Imágenes',
      manageBtnIcon: 'pi pi-images'
    }
  } as const;

  statuses = [
    { label: 'Activo', value: 'ACTIVO' },
    { label: 'Inactivo', value: 'INACTIVO' },
    { label: 'Agotado', value: 'AGOTADO' }
  ];

  badges = [
    { label: 'Ninguno', value: null },
    { label: 'Nuevo', value: 'NEW' },
    { label: 'Más vendido', value: 'BESTSELLER' },
    { label: 'Oferta', value: 'OFFER' }
  ];

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
      { name: 'price', label: 'Precio (S/.) *', type: 'number', mode: 'decimal', min: 0.01, minFractionDigits: 2 },
      { name: 'originalPrice', label: 'Precio Original (Opcional)', type: 'number', mode: 'decimal', min: 0, minFractionDigits: 2 }
    ],
    [
      { name: 'stockQuantity', label: 'Stock Inicial *', type: 'number', mode: 'decimal', min: 0 },
      { name: 'status', label: 'Estado *', type: 'select', optionsKey: 'statuses', optionLabel: 'label', optionValue: 'value', placeholder: 'Seleccionar estado' },
      { name: 'badge', label: 'Insignia', type: 'select', optionsKey: 'badges', optionLabel: 'label', optionValue: 'value', placeholder: 'Sin insignia' }
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
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    originalPrice: [null as number | null],
    badge: [null as string | null],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    status: ['ACTIVO', Validators.required],
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
    if (key === 'statuses') return this.statuses;
    if (key === 'badges') return this.badges;
    return [];
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }

  specificationsList = signal<{ key: string; value: string }[]>([]);

  addSpecification() {
    this.specificationsList.update(list => [...list, { key: '', value: '' }]);
  }

  removeSpecification(index: number) {
    this.specificationsList.update(list => list.filter((_, i) => i !== index));
  }

  ngOnChanges() {
    if (this.product) {
      this.form.patchValue({
        productName: this.product.productName,
        sku: this.product.sku,
        idCategory: this.product.idCategory,
        idBrand: this.product.idBrand,
        price: this.product.price,
        originalPrice: this.product.originalPrice ?? null,
        badge: this.product.badge ?? null,
        stockQuantity: this.product.stockQuantity,
        description: this.product.description,
        status: this.product.status || 'ACTIVO'
      });
      if (this.product.specifications) {
        const list = Object.entries(this.product.specifications).map(([key, value]) => ({
          key,
          value: String(value)
        }));
        this.specificationsList.set(list);
      } else {
        this.specificationsList.set([]);
      }
    } else {
      this.form.reset({ price: 0, originalPrice: null, badge: null, stockQuantity: 0, status: 'ACTIVO' });
      this.specificationsList.set([]);
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const specsMap: Record<string, any> = {};
    this.specificationsList().forEach(spec => {
      if (spec.key.trim() && spec.value.trim()) {
        specsMap[spec.key.trim()] = spec.value.trim();
      }
    });

    const requestData: CreateProductRequest = {
      ...(this.form.value as unknown as CreateProductRequest),
      specifications: specsMap
    };

    this.save.emit(requestData);
  }

  onCancel() {
    this.form.reset({ price: null, originalPrice: null, badge: null, stockQuantity: 0, status: 'ACTIVO' });
    this.specificationsList.set([]);
    this.cancel.emit();
    this.visibleChange.emit(false);
  }

  onManageImages() {
    if (this.product) {
      this.manageImages.emit(this.product);
    }
  }
}
