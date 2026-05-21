import { Component, OnInit, inject, signal } from '@angular/core';
import { HeroBannerComponent }         from './components/hero-banner/hero-banner';
import { FeaturedCategoriesComponent } from './components/featured-categories/featured-categories';
import { FeaturedProductsComponent }   from './components/featured-products/featured-products';
import { PromoBannerComponent }        from './components/promo-banner/promo-banner';
import { TrustBadgesComponent }        from './components/trust-badges/trust-badges';
import { FaqSectionComponent }         from './components/faq-section/faq-section';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroBannerComponent, FeaturedCategoriesComponent,
    FeaturedProductsComponent, PromoBannerComponent,
    TrustBadgesComponent, FaqSectionComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  featured    = signal<Product[]>([]);
  newArrivals = signal<Product[]>([]);
  bestSellers = signal<Product[]>([]);

  ngOnInit() {
    this.productService.getAll({ page: 0, size: 8 }).subscribe(r => this.featured.set(r.content));
    this.productService.getAll({ page: 1, size: 8 }).subscribe(r => this.newArrivals.set(r.content));
    this.productService.getAll({ badge: 'BESTSELLER', size: 8, page: 0 }).subscribe(r => this.bestSellers.set(r.content));
  }
}