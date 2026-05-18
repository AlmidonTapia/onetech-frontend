import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { Category, CreateCategoryRequest } from '../../../../../core/models/category.model';

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
  @Output() save = new EventEmitter<CreateCategoryRequest>();
  @Output() cancel = new EventEmitter<void>();

  content = {
    dialogWidth: '460px',
    titleNew: 'Nueva Categoría',
    titleEdit: 'Editar Categoría',
    optionalText: '(opcional)',
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
    [{ name: 'categoryName', label: 'Nombre *', type: 'text', placeholder: 'Ej: Laptops & PCs' }],
    [{ name: 'parentIdCategory', label: 'Categoría padre', type: 'select', optionsKey: 'parentOptions', optionLabel: 'categoryName', optionValue: 'idCategory', placeholder: 'Sin categoría padre', optional: true }]
  ];

  form = this.fb.group({
    categoryName: ['', [Validators.required, Validators.minLength(2)]],
    parentIdCategory: [null as string | null],
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
      ? this.form.patchValue({ categoryName: this.category.categoryName, parentIdCategory: this.category.parentIdCategory ?? null })
      : this.form.reset();
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value as CreateCategoryRequest);
  }

  onCancel() {
    this.form.reset();
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
