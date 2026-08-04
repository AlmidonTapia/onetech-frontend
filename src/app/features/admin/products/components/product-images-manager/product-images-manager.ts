import { Component, Input, Output, EventEmitter, OnChanges, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { AlertService } from '../../../../../shared/services/alert.service';
import { Product, ProductImage } from '../../../../../core/domains/catalog/models/product.model';
import { ProductService } from '../../../../../core/domains/catalog/services/product.service';

@Component({
  selector: 'app-product-images-manager',
  standalone: true,
  imports: [DialogModule, FileUploadModule, TooltipModule, ButtonComponent],
  templateUrl: './product-images-manager.html'
})
export class ProductImagesManagerComponent implements OnChanges { 
  private productService = inject(ProductService);
  private alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);
  @Input() visible = false;
  @Input() product: Product | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<void>();

  images = signal<ProductImage[]>([]);
  uploading = signal(false);

  get content() {
    return {
      headerPrefix: 'Imágenes — ',
      dialogWidth: '620px',
      altText: 'Imagen del producto',
      mainBadgeLabel: 'Principal',
      emptyMessage: 'Sin imágenes. Sube la primera imagen abajo.',
      uploadedImages: 'Imágenes cargadas',
      setMainTooltip: 'Establecer como principal',
      deleteTooltip: 'Eliminar imagen',
      uploadNewTitle: 'Subir nuevas imágenes',
      uploadConfig: {
        mode: 'advanced' as const,
        accept: 'image/*, image/webp, .webp',
        chooseLabel: 'Elegir imágenes',
        uploadLabel: 'Subir',
        cancelLabel: 'Limpiar',
        maxFileSize: 10000000,
        styleClass: 'upload-area',
        uploadNote: 'Soporta múltiples archivos. Límite de 5 imágenes en total. Tamaño máx: 10MB.'
      },
      actions: {
        closeLabel: 'Cerrar'
      }
    };
  }

  ngOnChanges() {
    if (this.product) {
      this.productService.getImages(this.product.idProduct).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (imgs) => this.images.set(imgs || []),
        error: () => this.images.set(this.product!.images ?? [])
      });
    }
  }

  onUpload(event: any, fileUpload: any) {
    if (!this.product) return;

    this.uploading.set(true);
    const files: File[] = event.files;

    this.productService.uploadImages(this.product.idProduct, files, 0).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Imágenes subidas con éxito');
        this.productService.getImages(this.product!.idProduct).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
        const errorMsg = err?.error?.message || 'Error al subir imágenes';
        this.alertService.error(errorMsg);
        this.uploading.set(false);
      }
    });
  }

  deleteImage(idImage: string) {
    if (!this.product) return;

    this.productService.deleteImage(this.product.idProduct, idImage).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.alertService.success('Imagen eliminada');
        this.images.update((imgs: ProductImage[]) => imgs.filter((img: ProductImage) => img.idProductImage !== idImage));
        this.updated.emit();
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || 'Error al eliminar la imagen');
      }
    });
  }

  setAsPrincipal(idImage: string) {
    if (!this.product) return;

    this.productService.setPrincipalImage(this.product.idProduct, idImage).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
      error: (err: any) => {
        this.alertService.error(err?.error?.message || 'Error al establecer la imagen principal');
      }
    });
  }

  close() {
    this.visibleChange.emit(false);
  }
}
