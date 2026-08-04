import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../../../../shared/components/product-card/product-card';
import { Product } from '../../../../../core/domains/catalog/models/product.model';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './featured-products.html'
})
export class FeaturedProductsComponent {
  @Input() products: Product[] = [];
  @Input() title = 'Productos destacados';

  skeletonConfig = {
    items: Array(4).fill(0)
  };

  content = {
    viewAllText: 'Ver todos →',
    viewAllRoute: '/catalog'
  };
}
