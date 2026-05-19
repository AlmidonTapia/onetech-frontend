import { Component, OnInit, inject, signal } from '@angular/core';
import { BrandsTableComponent } from './components/brands-table/brands-table';
import { BrandFormComponent } from './components/brand-form/brand-form';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { CardComponent } from '../../../shared/components/ui/card/card';
import { AlertService } from '../../../shared/services/alert.service';
import { ModalService } from '../../../shared/services/modal.service';
import { BrandService } from '../../../core/services/brand.service';
import { Brand, CreateBrandRequest } from '../../../core/models/brand.model';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [BrandsTableComponent, BrandFormComponent, ButtonComponent, CardComponent],
  templateUrl: './brands.html',
  styleUrl: './brands.css'
})
export class BrandsComponent implements OnInit {
  private brandService = inject(BrandService);
  private alertService = inject(AlertService);
  private modalService = inject(ModalService);

  brands = signal<Brand[]>([]);
  totalRecords = signal(0);
  loading = signal(false);
  saving = signal(false);
  formVisible = signal(false);
  editingBrand = signal<Brand | null>(null);

  // ── REGLAS DE NEGOCIO Y CONFIGURACIÓN DE APIS ──
  apiConfig = {
    pageSize: 10
  };

  // ── CONTENIDO ADMINISTRABLE DE TEXTOS Y CONFIRMACIONES ──
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
    this.loadBrands();
  }

  loadBrands(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.brandService.getAll(page, this.apiConfig.pageSize).subscribe({
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

  onSave(data: CreateBrandRequest) {
    this.saving.set(true);
    const currentBrand = this.editingBrand();
    const request$ = currentBrand
      ? this.brandService.update(currentBrand.idBrand, data as any)
      : this.brandService.create(data);

    request$.subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.saveSuccess);
        this.formVisible.set(false);
        this.saving.set(false);
        this.loadBrands();
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
