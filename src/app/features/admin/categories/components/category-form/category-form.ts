import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../../../../core/domains/catalog/models/category.model';
import { CategoryStatus } from '../../../../../core/domains/catalog/enums/category-status.enum';
import { TranslationService as AppTranslationService } from '../../../../../core/services/translation.service';
import { noWhitespaceValidator } from '../../../../../shared/validators/no-whitespace.validator';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, InputTextModule, SelectModule, ButtonComponent],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible: boolean = false;
  @Input() category: Category | null = null;
  @Input() categories: Category[] = [];
  @Input() saving = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateCategoryRequest | UpdateCategoryRequest>();
  @Output() cancel = new EventEmitter<void>();

  ts = inject(AppTranslationService);
  t = this.ts.t;

  get content() {
    return {
      dialogWidth: '460px',
      titleNew: this.t().adminCategories.form.titleNew,
      titleEdit: this.t().adminCategories.form.titleEdit,
      optionalText: this.t().adminCategories.form.optionalText,
      errorRequired: this.t().adminCategories.form.errorRequired,
      styles: {
        selectWidth: '100%',
        appendTo: 'body'
      },
      actions: {
        cancelLabel: this.t().adminCategories.form.actions.cancelLabel,
        saveLabel: this.t().adminCategories.form.actions.saveLabel,
        saveIcon: 'pi-check'
      },
      status: {
        label: this.t().adminCategories.form.status.label
      }
    };
  }

  get statusOptions() {
    return [
      { label: this.t().adminCategories.form.status.enabled, value: CategoryStatus.HABILITADO },
      { label: this.t().adminCategories.form.status.disabled, value: CategoryStatus.DESHABILITADO }
    ];
  }

  get formConfig(): any[] {
    return [
      [{ name: 'categoryName', label: this.t().adminCategories.form.fields.name, type: 'text', placeholder: this.t().adminCategories.form.fields.namePlaceholder }],
      [{ name: 'parentIdCategory', label: this.t().adminCategories.form.fields.parent, type: 'select', optionsKey: 'parentOptions', optionLabel: 'categoryName', optionValue: 'idCategory', placeholder: this.t().adminCategories.form.fields.parentPlaceholder, optional: true }]
    ];
  }

  form = this.fb.group({
    categoryName: ['', [Validators.required, noWhitespaceValidator(), Validators.minLength(2)]],
    parentIdCategory: [null as string | null],
    status: [CategoryStatus.HABILITADO]
  });

  get title() {
    return this.category ? this.content.titleEdit : this.content.titleNew;
  }

  get parentOptions() {
    return this.categories.filter(c => c.idCategory !== this.category?.idCategory);
  }

  getOptions(key: string) {
    if (key === 'parentOptions') return this.parentOptions;
    return [];
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }

  ngOnChanges() {
    this.category
      ? this.form.patchValue({ categoryName: this.category.categoryName, parentIdCategory: this.category.parentIdCategory ?? null, status: this.category.status as CategoryStatus })
      : this.form.reset({ status: CategoryStatus.HABILITADO });
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const req = this.category
      ? (this.form.value as UpdateCategoryRequest)
      : ({ categoryName: this.form.value.categoryName, parentIdCategory: this.form.value.parentIdCategory } as CreateCategoryRequest);
    this.save.emit(req);
  }

  onCancel() {
    this.form.reset();
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
