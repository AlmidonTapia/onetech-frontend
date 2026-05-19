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

  apiConfig = {
    pageSize: 10
  };

  content = {
    title: 'Categorías',
    countSuffix: 'categorías registradas',
    createBtnLabel: 'Nueva categoría',
    createBtnIcon: 'pi-plus',
    cardPadding: 'none',
    alerts: {
      saveSuccess: 'Categoría guardada',
      saveError: 'Error al guardar',
      deleteNotImplemented: 'Eliminar categorías no implementado aún'
    },
    confirmModal: {
      title: '¿Eliminar categoría?',
      severity: 'danger',
      confirmLabel: 'Sí, eliminar'
    }
  } as const;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.categoryService.getAll(page, this.apiConfig.pageSize).subscribe({
      next: r => {
        this.categories.set(r.content);
        this.totalRecords.set(r.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate() {
    this.editingCat.set(null);
    this.formVisible.set(true);
  }

  openEdit(c: Category) {
    this.editingCat.set(c);
    this.formVisible.set(true);
  }

  onSave(data: CreateCategoryRequest) {
    this.saving.set(true);
    const currentCat = this.editingCat();
    const request$ = currentCat
      ? this.categoryService.update(currentCat.idCategory, data as any)
      : this.categoryService.create(data);

    request$.subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.saveSuccess);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadCategories();
      },
      error: () => {
        this.alertService.error(this.content.alerts.saveError);
        this.saving.set(false);
      }
    });
  }

  onDelete(c: Category) {
    this.modalService.open({
      title: this.content.confirmModal.title,
      message: `"${c.categoryName}" será eliminada.`,
      severity: this.content.confirmModal.severity as any,
      confirmLabel: this.content.confirmModal.confirmLabel,
      onConfirm: () => {
        this.categoryService.delete(c.idCategory).subscribe({
          next: () => {
            this.alertService.success('Categoría eliminada exitosamente');
            this.loadCategories();
          },
          error: () => {
            this.alertService.error('Error al eliminar la categoría');
          }
        });
      },
    });
  }
}
