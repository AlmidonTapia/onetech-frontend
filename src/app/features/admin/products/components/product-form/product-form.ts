import { Component, Input, Output, EventEmitter, OnChanges, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Product, CreateProductRequest, UpdateProductRequest } from '../../../../../core/domains/catalog/models/product.model';
import { Category } from '../../../../../core/domains/catalog/models/category.model';
import { Brand } from '../../../../../core/domains/catalog/models/brand.model';
import { CategoryService } from '../../../../../core/domains/catalog/services/category.service';
import { BrandService } from '../../../../../core/domains/catalog/services/brand.service';
import { TranslationService } from '../../../../../core/services/translation.service';
import { noWhitespaceValidator } from '../../../../../shared/validators/no-whitespace.validator';

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
  ts = inject(TranslationService);
  t = this.ts.t;

  @Input() visible = false;
  @Input() product: Product | null = null;
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateProductRequest | UpdateProductRequest>();
  @Output() cancel = new EventEmitter<void>();
  @Output() manageImages = new EventEmitter<Product>();

  categories = signal<Category[]>([]);
  brands = signal<Brand[]>([]);

  get content() {
    return {
      dialogWidth: '600px',
      titleNew: this.t().adminProducts.form.titleNew,
      titleEdit: this.t().adminProducts.form.titleEdit,
      errorRequired: this.t().adminProducts.form.errorRequired,
      metaLabel: this.t().adminProducts.form.metaLabel,
      styles: {
        selectWidth: '100%',
        appendTo: 'body'
      },
      actions: {
        cancelLabel: this.t().adminProducts.form.cancelLabel,
        saveLabel: this.t().adminProducts.form.saveLabel,
        saveIcon: 'pi-check'
      },
      specs: {
        title: this.t().adminProducts.form.specs.title,
        addLabel: this.t().adminProducts.form.specs.addLabel,
        addIcon: 'pi-plus',
        keyPlaceholder: this.t().adminProducts.form.specs.keyPlaceholder,
        valuePlaceholder: this.t().adminProducts.form.specs.valuePlaceholder,
        deleteTitle: this.t().adminProducts.form.specs.deleteTitle,
        emptyMessage: this.t().adminProducts.form.specs.emptyMessage
      },
      imagesInfo: {
        newProductMsg: this.t().adminProducts.form.imagesInfo.newProductMsg,
        manageBtnLabel: this.t().adminProducts.form.imagesInfo.manageBtnLabel,
        manageBtnIcon: 'pi pi-images'
      }
    };
  }

  get statuses() {
    return [
      { label: this.t().adminProducts.table.status.active, value: 'ACTIVO' },
      { label: this.t().adminProducts.table.status.inactive, value: 'INACTIVO' },
      { label: this.t().adminProducts.table.status.outOfStock, value: 'AGOTADO' }
    ];
  }

  get badges() {
    return [
      { label: this.t().adminProducts.form.badges.none, value: null },
      { label: this.t().adminProducts.form.badges.new, value: 'NEW' },
      { label: this.t().adminProducts.form.badges.bestseller, value: 'BESTSELLER' },
      { label: this.t().adminProducts.form.badges.offer, value: 'OFFER' }
    ];
  }

  get formConfig(): any[] {
    return [
      [
        { name: 'productName', label: this.t().adminProducts.form.fields.name, type: 'text', placeholder: this.t().adminProducts.form.fields.namePlaceholder },
        { name: 'sku', label: this.t().adminProducts.form.fields.sku, type: 'text', placeholder: this.t().adminProducts.form.fields.skuPlaceholder }
      ],
      [
        { name: 'idCategory', label: this.t().adminProducts.form.fields.category, type: 'select', optionsKey: 'categories', optionLabel: 'categoryName', optionValue: 'idCategory', placeholder: this.t().adminProducts.form.fields.categoryPlaceholder },
        { name: 'idBrand', label: this.t().adminProducts.form.fields.brand, type: 'select', optionsKey: 'brands', optionLabel: 'brandName', optionValue: 'idBrand', placeholder: this.t().adminProducts.form.fields.brandPlaceholder }
      ],
      [
        { name: 'price', label: this.t().adminProducts.form.fields.price, type: 'number', mode: 'decimal', min: 0.01, minFractionDigits: 2 },
        { name: 'originalPrice', label: this.t().adminProducts.form.fields.originalPrice, type: 'number', mode: 'decimal', min: 0, minFractionDigits: 2 }
      ],
      [
        { name: 'stockQuantity', label: this.t().adminProducts.form.fields.stock, type: 'number', mode: 'decimal', min: 0 },
        { name: 'status', label: this.t().adminProducts.form.fields.status, type: 'select', optionsKey: 'statuses', optionLabel: 'label', optionValue: 'value', placeholder: this.t().adminProducts.form.fields.statusPlaceholder },
        { name: 'badge', label: this.t().adminProducts.form.fields.badge, type: 'select', optionsKey: 'badges', optionLabel: 'label', optionValue: 'value', placeholder: this.t().adminProducts.form.fields.badgePlaceholder }
      ],
      [
        { name: 'description', label: this.t().adminProducts.form.fields.description, type: 'textarea', placeholder: this.t().adminProducts.form.fields.descriptionPlaceholder }
      ]
    ];
  }

  form = this.fb.group({
    productName: ['', [Validators.required, noWhitespaceValidator(), Validators.minLength(3)]],
    sku: ['', [Validators.required, noWhitespaceValidator()]],
    idCategory: ['', Validators.required],
    idBrand: ['', Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    originalPrice: [null as number | null],
    badge: [null as string | null],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    status: ['ACTIVO', Validators.required],
    description: ['', [Validators.required, noWhitespaceValidator()]]
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

    const requestData = this.product 
      ? ({ ...(this.form.value as unknown as UpdateProductRequest), specifications: specsMap } as UpdateProductRequest)
      : ({ 
          idCategory: this.form.value.idCategory,
          idBrand: this.form.value.idBrand,
          productName: this.form.value.productName,
          sku: this.form.value.sku,
          description: this.form.value.description,
          price: this.form.value.price,
          originalPrice: this.form.value.originalPrice,
          badge: this.form.value.badge,
          stockQuantity: this.form.value.stockQuantity,
          specifications: specsMap 
        } as CreateProductRequest);

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
