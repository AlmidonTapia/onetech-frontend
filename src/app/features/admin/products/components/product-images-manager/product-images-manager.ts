import { Component, Input, Output, EventEmitter, OnChanges, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { AlertService } from '../../../../../shared/services/alert.service';
import { ProductService } from '../../../../../core/services/product.service';
import { Product, ProductImage } from '../../../../../core/models/product.model';

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

  ngOnChanges() {
    if (this.product && this.visible) this.loadImages();
  }

  loadImages() {
    if (!this.product) return;
    this.productService.getImages(this.product.id).subscribe(imgs => this.images.set(imgs));
  }

  onUpload(event: any) {
    if (!this.product) return;
    this.productService.uploadImages(this.product.id, event.files, 0).subscribe({
      next: () => { this.alertService.success('Imágenes subidas'); this.loadImages(); this.updated.emit(); },
      error: () => this.alertService.error('Error al subir imágenes'),
    });
  }

  deleteImage(imageId: string) {
    if (!this.product) return;
    this.productService.deleteImage(this.product.id, imageId).subscribe({
      next: () => { this.alertService.success('Imagen eliminada'); this.loadImages(); },
      error: () => this.alertService.error('Error al eliminar'),
    });
  }

  close() { this.visibleChange.emit(false); }
}