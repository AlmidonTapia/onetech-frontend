import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ProductImage } from '../../../../../core/domains/catalog/models/product.model';

import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-product-images',
  standalone: true,
  imports: [CommonModule, DialogModule, NgOptimizedImage, ButtonComponent],
  templateUrl: './product-images.html'
})
export class ProductImagesComponent {
  @Input() set images(imgs: ProductImage[]) {
    this._images = imgs;
    const main = imgs.find(i => i.isPrincipal) ?? imgs[0];
    if (main) this.active.set(main.imageUrl);
  }
  get images() { return this._images; }

  @Input() badge?: string;

  _images: ProductImage[] = [];
  active = signal<string | null>(null);
  zoomVisible = signal(false);

  toggleZoom() {
    this.zoomVisible.set(!this.zoomVisible());
  }
}
