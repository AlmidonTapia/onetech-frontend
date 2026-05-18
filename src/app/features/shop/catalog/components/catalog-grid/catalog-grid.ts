import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../../../../../shared/components/product-card/product-card';
import { Product } from '../../../../../core/models/product.model';

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

  content = {
    emptyIcon: 'pi pi-search',
    emptyTitle: 'Sin resultados',
    emptyDescription: 'Prueba con otros filtros o términos de búsqueda.'
  };
}
