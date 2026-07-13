import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../../../../../shared/components/product-card/product-card';
import { Product } from '../../../../../core/domains/catalog/models/product.model';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './related-products.html',
  styleUrl: './related-products.css'
})
export class RelatedProductsComponent {
  @Input() products: Product[] = [];

  displayConfig = {
    maxItems: 4
  };

  content = {
    title: 'Productos relacionados'
  };
}
