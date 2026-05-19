import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ProductImage } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-product-images',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './product-images.html',
  styleUrl: './product-images.css'
})
export class ProductImagesComponent {
  @Input() set images(imgs: ProductImage[]) {
    this._images = imgs;
    const main = imgs.find(i => i.isPrincipal) ?? imgs[0];
    if (main) this.active.set(main.imageUrl);
  }
  get images() { return this._images; }

  _images: ProductImage[] = [];
  active = signal<string | null>(null);
  zoomVisible = signal(false);

  content = {
    mainImageAlt: 'Imagen del producto',
    thumbImageAlt: 'Vista del producto',
    newBadge: 'NEW',
    referentialLabel: 'IMAGEN REFERENCIAL',
    zoomAriaLabel: 'Ampliar imagen',
    zoomImageAlt: 'Zoom de producto'
  };

  toggleZoom() {
    this.zoomVisible.set(!this.zoomVisible());
  }
}