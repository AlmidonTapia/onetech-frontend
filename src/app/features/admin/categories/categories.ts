import { Component, OnInit, inject, signal } from '@angular/core';
import { CategoriesTableComponent } from './components/categories-table/categories-table';
import { CategoryFormComponent } from './components/category-form/category-form';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { CardComponent } from '../../../shared/components/ui/card/card';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category, CreateCategoryRequest } from '../../../core/models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CategoriesTableComponent, CategoryFormComponent, ButtonComponent, CardComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);

  categories = signal<Category[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingCat = signal<Category | null>(null);

  ngOnInit() { this.loadCategories(); }

  loadCategories(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.categoryService.getAll(page, 10).subscribe({
      next: r => { this.categories.set(r.content); this.totalRecords.set(r.totalElements); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openCreate() { this.editingCat.set(null); this.formVisible.set(true); }
  openEdit(c: Category) { this.editingCat.set(c); this.formVisible.set(true); }

  onSave(data: CreateCategoryRequest) {
    this.saving.set(true);
    this.categoryService.create(data).subscribe({
      next: () => { this.alertService.success('Categoría guardada'); this.formVisible.set(false); this.saving.set(false); this.loadCategories(); },
      error: () => { this.alertService.error('Error al guardar'); this.saving.set(false); }
    });
  }

  onDelete(c: Category) {
    this.modalService.open({
      title: '¿Eliminar categoría?', message: `"${c.categoryName}" será eliminada.`,
      severity: 'danger', confirmLabel: 'Sí, eliminar',
      onConfirm: () => this.alertService.warn('Eliminar categorías no implementado aún'),
    });
  }
}