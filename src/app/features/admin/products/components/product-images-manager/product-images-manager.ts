import { Component, Input, Output, EventEmitter, OnChanges, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { AlertService } from '../../../../../shared/services/alert.service';
import { Product, ProductImage } from '../../../../../core/models/product.model';
import { ProductService } from '../../../../../core/services/product.service';

@Component({
  selector: 'app-product-images-manager',
  standalone: true,
  imports: [DialogModule, FileUploadModule, ButtonComponent],
  templateUrl: './product-images-manager.html',
  styleUrl: './product-images-manager.css'
})
export class ProductImagesManagerComponent implements OnChanges { 
  private productService = inject(ProductService);
  private alertService = inject(AlertService);

  @Input() visible = false;
  @Input() product: Product | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<void>();

  images = signal<ProductImage[]>([]);
  uploading = signal(false);

  content = {
    headerPrefix: 'Imágenes — ',
    dialogWidth: '620px',
    altText: 'Imagen del producto',
    mainBadgeLabel: 'Principal',
    emptyMessage: 'Sin imágenes. Sube la primera imagen abajo.',
    uploadConfig: {
      mode: 'advanced' as const,
      accept: 'image/*',
      chooseLabel: 'Elegir imágenes',
      uploadLabel: 'Subir',
      cancelLabel: 'Limpiar',
      maxFileSize: 10000000,
      styleClass: 'upload-area'
    },
    actions: {
      closeLabel: 'Cerrar'
    },
    alerts: {
      uploadSuccess: 'Imágenes subidas con éxito',
      uploadError: 'Error al subir imágenes',
      deleteSuccess: 'Imagen eliminada',
      deleteError: 'Error al eliminar la imagen'
    }
  } as const;

  ngOnChanges() {
    if (this.product) {
      this.productService.getImages(this.product.idProduct).subscribe({
        next: (imgs) => this.images.set(imgs || []),
        error: () => this.images.set(this.product!.images ?? [])
      });
    }
  }

  onUpload(event: any, fileUpload: any) {
    if (!this.product) return;

    this.uploading.set(true);
    const files: File[] = event.files;

    this.productService.uploadImages(this.product.idProduct, files, 0).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.uploadSuccess);
        this.productService.getImages(this.product!.idProduct).subscribe({
          next: (imgs) => {
            this.images.set(imgs || []);
            this.updated.emit();
            this.uploading.set(false);
            if (fileUpload) {
              fileUpload.clear();
            }
          },
          error: () => {
            this.uploading.set(false);
          }
        });
      },
      error: (err: any) => {
        const errorMsg = err?.error?.message || this.content.alerts.uploadError;
        this.alertService.error(errorMsg);
        this.uploading.set(false);
      }
    });
  }

  deleteImage(idImage: string) {
    if (!this.product) return;

    this.productService.deleteImage(this.product.idProduct, idImage).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.deleteSuccess);
        this.images.update((imgs: ProductImage[]) => imgs.filter((img: ProductImage) => img.idProductImage !== idImage));
        this.updated.emit();
      },
      error: () => {
        this.alertService.error(this.content.alerts.deleteError);
      }
    });
  }

  setAsPrincipal(idImage: string) {
    if (!this.product) return;

    this.productService.setPrincipalImage(this.product.idProduct, idImage).subscribe({
      next: () => {
        this.alertService.success('Imagen establecida como principal');
        this.images.update((imgs: ProductImage[]) =>
          imgs.map((img: ProductImage) => ({
            ...img,
            isPrincipal: img.idProductImage === idImage
          }))
        );
        this.updated.emit();
      },
      error: () => {
        this.alertService.error('Error al establecer la imagen principal');
      }
    });
  }

  close() {
    this.visibleChange.emit(false);
  }
}
