import { ViewChild } from '@angular/core';
import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { BrandsTableComponent } from './components/brands-table/brands-table';
import { BrandFormComponent } from './components/brand-form/brand-form';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { BrandService } from '../../../core/domains/catalog/services/brand.service';
import { Brand, CreateBrandRequest } from '../../../core/domains/catalog/models/brand.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { handleFormError } from '../../../shared/utils/form-error.util';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [BrandsTableComponent, BrandFormComponent, ButtonComponent],
  templateUrl: './brands.html'
})
export class BrandsComponent implements OnInit {
  private brandService = inject(BrandService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private destroyRef = inject(DestroyRef);
  @ViewChild(BrandFormComponent) brandForm!: BrandFormComponent;

  brands = signal<Brand[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingBrand = signal<Brand | null>(null);
  searchTerm = signal<string | undefined>(undefined);
  searchSubject = new Subject<string>();

  apiConfig = {
    pageSize: 10
  };

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(term => {
      this.searchTerm.set(term);
      this.loadBrands({ first: 0, rows: this.apiConfig.pageSize });
    });
    this.loadBrands();
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  loadBrands(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.brandService.getAll(page, this.apiConfig.pageSize, this.searchTerm()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r => {
        this.brands.set(r.content);
        this.totalRecords.set(r.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreate() {
    this.editingBrand.set(null);
    this.formVisible.set(true);
  }

  openEdit(b: Brand) {
    this.editingBrand.set(b);
    this.formVisible.set(true);
  }

  onSave(payload: { request: CreateBrandRequest, file?: File }) {
    this.saving.set(true);
    const currentBrand = this.editingBrand();
    const { request, file } = payload;
    
    const request$ = currentBrand
      ? this.brandService.update(currentBrand.idBrand, request as any)
      : this.brandService.create(request);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response: any) => {
        const brandId = currentBrand ? currentBrand.idBrand : response.id;
        if (file && brandId) {
          this.brandService.uploadImage(brandId, file).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
              this.alertService.success('Marca guardada');
              this.formVisible.set(false);
              this.saving.set(false);
              this.loadBrands();
            },
            error: () => {
              this.alertService.error('Marca guardada, pero ocurrió un error al subir la imagen');
              this.saving.set(false);
              this.formVisible.set(false);
              this.loadBrands();
            }
          });
        } else {
          this.alertService.success('Marca guardada');
          this.formVisible.set(false);
          this.saving.set(false);
          this.loadBrands();
        }
      },
      error: (err) => {
        const errorMsg = handleFormError(err, this.brandForm.form) || undefined;
        this.alertService.error('Error al guardar', errorMsg);
        this.saving.set(false);
      }
    });
  }

  onDelete(b: Brand) {
    this.modalService.open({
      title: '¿Eliminar marca?',
      message: `"${b.brandName}" ${'será eliminada.'}`,
      severity: 'danger',
      confirmLabel: 'Sí, eliminar',
      onConfirm: () => {
        this.brandService.delete(b.idBrand).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => {
            this.alertService.success('Marca eliminada exitosamente');
            this.loadBrands();
          },
          error: (err: any) => this.alertService.error(err?.error?.message || 'Error al eliminar la marca'),
        });
      },
    });
  }
}
