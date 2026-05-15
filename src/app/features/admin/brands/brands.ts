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
  selector: 'app-brands', standalone: true,
  imports: [BrandsTableComponent, BrandFormComponent, ButtonComponent, CardComponent],
  templateUrl: './brands.html', styleUrl: './brands.css'
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

  ngOnInit() { this.loadBrands(); }

  loadBrands(event?: any) {
    const page = event ? Math.floor(event.first / event.rows) : 0;
    this.loading.set(true);
    this.brandService.getAll(page, 10).subscribe({
      next: r => { this.brands.set(r.content); this.totalRecords.set(r.totalElements); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openCreate() { this.editingBrand.set(null); this.formVisible.set(true); }
  openEdit(b: Brand) { this.editingBrand.set(b); this.formVisible.set(true); }

  onSave(data: CreateBrandRequest) {
    this.saving.set(true);
    this.brandService.create(data).subscribe({
      next: () => { this.alertService.success('Marca guardada'); this.formVisible.set(false); this.saving.set(false); this.loadBrands(); },
      error: () => { this.alertService.error('Error al guardar'); this.saving.set(false); }
    });
  }

  onDelete(b: Brand) {
    this.modalService.open({
      title: '¿Eliminar marca?', message: `"${b.brandName}" será eliminada.`,
      severity: 'danger', confirmLabel: 'Sí, eliminar',
      onConfirm: () => this.alertService.warn('Eliminar marcas no implementado en el backend aún'),
    });
  }
}