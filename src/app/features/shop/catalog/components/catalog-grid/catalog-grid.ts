import { Component, Input, inject } from '@angular/core';
import { TranslationService } from '../../../../../core/services/translation.service';
import { ProductCardComponent } from '../../../../../shared/components/product-card/product-card';
import { Product } from '../../../../../core/domains/catalog/models/product.model';

@Component({
  selector: 'app-catalog-grid',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './catalog-grid.html',
  styleUrl: './catalog-grid.css'
})
export class CatalogGridComponent {
  @Input() products: Product[] = [];
  @Input() loading = false;

  skeletonConfig = {
    items: Array(8).fill(0)
  };

  ts = inject(TranslationService);
  t = this.ts.t;
}
