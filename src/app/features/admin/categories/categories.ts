import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CategoriesTableComponent } from './components/categories-table/categories-table';
import { CategoryFormComponent } from './components/category-form/category-form';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { CategoryService } from '../../../core/domains/catalog/services/category.service';
import { Category, CreateCategoryRequest } from '../../../core/domains/catalog/models/category.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { handleFormError } from '../../../shared/utils/form-error.util';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CategoriesTableComponent, CategoryFormComponent, ButtonComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private destroyRef = inject(DestroyRef);

  @ViewChild(CategoryFormComponent) categoryForm!: CategoryFormComponent;

  categories = signal<Category[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingCat = signal<Category | null>(null);
  searchTerm = signal<string | undefined>(undefined);
  searchSubject = new Subject<string>();

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
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(term => {
      this.searchTerm.set(term);
      this.loadCategories({ first: 0, rows: this.apiConfig.pageSize });
    });
    this.loadCategories();
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  loadCategories(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.categoryService.getAll(page, this.apiConfig.pageSize, this.searchTerm()).subscribe({
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
      error: (err) => {
        const errorMsg = handleFormError(err, this.categoryForm.form) || undefined;
        this.alertService.error(this.content.alerts.saveError, errorMsg);
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
          error: (err: any) => {
            this.alertService.error(err?.error?.message || 'Error al eliminar la categoría');
          }
        });
      },
    });
  }
}
