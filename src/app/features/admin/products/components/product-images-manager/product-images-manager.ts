import { Component, Input, Output, EventEmitter, OnChanges, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { AlertService } from '../../../../../shared/services/alert.service';
import { Product, ProductImage } from '../../../../../core/domains/catalog/models/product.model';
import { ProductService } from '../../../../../core/domains/catalog/services/product.service';
import { TranslationService } from '../../../../../core/services/translation.service';

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
  ts = inject(TranslationService);
  t = this.ts.t;

  @Input() visible = false;
  @Input() product: Product | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<void>();

  images = signal<ProductImage[]>([]);
  uploading = signal(false);

  get content() {
    return {
      headerPrefix: this.t().adminProducts.images.headerPrefix,
      dialogWidth: '620px',
      altText: this.t().adminProducts.images.altText,
      mainBadgeLabel: this.t().adminProducts.images.mainBadgeLabel,
      emptyMessage: this.t().adminProducts.images.emptyMessage,
      uploadedImages: this.t().adminProducts.images.uploadedImages,
      setMainTooltip: this.t().adminProducts.images.setMainTooltip,
      deleteTooltip: this.t().adminProducts.images.deleteTooltip,
      uploadNewTitle: this.t().adminProducts.images.uploadNewTitle,
      uploadConfig: {
        mode: 'advanced' as const,
        accept: 'image/*, image/webp, .webp',
        chooseLabel: this.t().adminProducts.images.upload.chooseLabel,
        uploadLabel: this.t().adminProducts.images.upload.uploadLabel,
        cancelLabel: this.t().adminProducts.images.upload.cancelLabel,
        maxFileSize: 10000000,
        styleClass: 'upload-area',
        uploadNote: this.t().adminProducts.images.upload.note
      },
      actions: {
        closeLabel: this.t().adminProducts.images.closeLabel
      }
    };
  }

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
        this.alertService.success(this.t().adminProducts.alerts.imageUploadSuccess);
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
        const errorMsg = err?.error?.message || this.t().adminProducts.alerts.imageUploadError;
        this.alertService.error(errorMsg);
        this.uploading.set(false);
      }
    });
  }

  deleteImage(idImage: string) {
    if (!this.product) return;

    this.productService.deleteImage(this.product.idProduct, idImage).subscribe({
      next: () => {
        this.alertService.success(this.t().adminProducts.alerts.imageDeleteSuccess);
        this.images.update((imgs: ProductImage[]) => imgs.filter((img: ProductImage) => img.idProductImage !== idImage));
        this.updated.emit();
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || this.t().adminProducts.alerts.imageDeleteError);
      }
    });
  }

  setAsPrincipal(idImage: string) {
    if (!this.product) return;

    this.productService.setPrincipalImage(this.product.idProduct, idImage).subscribe({
      next: () => {
        this.alertService.success(this.t().adminProducts.alerts.imageMainSuccess);
        this.images.update((imgs: ProductImage[]) =>
          imgs.map((img: ProductImage) => ({
            ...img,
            isPrincipal: img.idProductImage === idImage
          }))
        );
        this.updated.emit();
      },
      error: (err: any) => {
        this.alertService.error(err?.error?.message || this.t().adminProducts.alerts.imageMainError);
      }
    });
  }

  close() {
    this.visibleChange.emit(false);
  }
}
