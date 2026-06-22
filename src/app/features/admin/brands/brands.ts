import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { BrandsTableComponent } from './components/brands-table/brands-table';
import { BrandFormComponent } from './components/brand-form/brand-form';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { BrandService } from '../../../core/services/brand.service';
import { Brand, CreateBrandRequest } from '../../../core/models/brand.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [BrandsTableComponent, BrandFormComponent, ButtonComponent],
  templateUrl: './brands.html',
  styleUrl: './brands.css'
})
export class BrandsComponent implements OnInit {
  private brandService = inject(BrandService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private destroyRef = inject(DestroyRef);

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

  content = {
    title: 'Marcas',
    countSuffix: 'marcas registradas',
    createBtnLabel: 'Nueva marca',
    createBtnIcon: 'pi-plus',
    cardPadding: 'none',
    alerts: {
      saveSuccess: 'Marca guardada',
      saveError: 'Error al guardar',
      deleteNotImplemented: 'Eliminar marcas no implementado en el backend aún'
    },
    confirmModal: {
      title: '¿Eliminar marca?',
      severity: 'danger',
      confirmLabel: 'Sí, eliminar'
    }
  } as const;;

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
    this.brandService.getAll(page, this.apiConfig.pageSize, this.searchTerm()).subscribe({
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

    request$.subscribe({
      next: (response: any) => {
        const brandId = currentBrand ? currentBrand.idBrand : response;
        if (file && brandId) {
          this.brandService.uploadImage(brandId, file).subscribe({
            next: () => {
              this.alertService.success(this.content.alerts.saveSuccess);
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
          this.alertService.success(this.content.alerts.saveSuccess);
          this.formVisible.set(false);
          this.saving.set(false);
          this.loadBrands();
        }
      },
      error: () => {
        this.alertService.error(this.content.alerts.saveError);
        this.saving.set(false);
      }
    });
  }

  onDelete(b: Brand) {
    this.modalService.open({
      title: this.content.confirmModal.title,
      message: `"${b.brandName}" será eliminada.`,
      severity: this.content.confirmModal.severity as any,
      confirmLabel: this.content.confirmModal.confirmLabel,
      onConfirm: () => {
        this.brandService.delete(b.idBrand).subscribe({
          next: () => {
            this.alertService.success('Marca eliminada exitosamente');
            this.loadBrands();
          },
          error: () => {
            this.alertService.error('Error al eliminar la marca');
          }
        });
      },
    });
  }
}
