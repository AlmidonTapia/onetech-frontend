import { Component, OnInit, inject, signal } from '@angular/core';
import { HeroBannerComponent }         from './components/hero-banner/hero-banner';
import { FeaturedCategoriesComponent } from './components/featured-categories/featured-categories';
import { FeaturedProductsComponent }   from './components/featured-products/featured-products';
import { PromoBannerComponent }        from './components/promo-banner/promo-banner';
import { TrustBadgesComponent }        from './components/trust-badges/trust-badges';
import { FaqSectionComponent }         from './components/faq-section/faq-section';
import { BrandCarouselComponent }      from './components/brand-carousel/brand-carousel';
import { ProductService } from '../../../core/domains/catalog/services/product.service';
import { BrandService } from '../../../core/domains/catalog/services/brand.service';
import { Product } from '../../../core/domains/catalog/models/product.model';
import { SeoService } from '../../../core/domains/shared/services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroBannerComponent, FeaturedCategoriesComponent,
    FeaturedProductsComponent, PromoBannerComponent,
    TrustBadgesComponent, FaqSectionComponent, BrandCarouselComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private brandService = inject(BrandService);
  private seoService = inject(SeoService);

  featured    = signal<Product[]>([]);
  newArrivals = signal<Product[]>([]);
  bestSellers = signal<Product[]>([]);
  brands      = signal<any[]>([]);

  content = {
    sections: {
      featured: 'Productos destacados',
      newArrivals: 'Nuevos ingresos',
      bestSellers: 'Lo más vendido'
    }
  };
  ngOnInit() {
    this.seoService.setMetaData({
      title: 'Inicio',
      description: 'La mejor tienda de tecnología en línea. Compra laptops, smartphones y accesorios con envíos a todo el país.'
    });

    this.productService.getAll({ page: 0, size: 8 }).subscribe(r => this.featured.set(r.content));
    this.productService.getAll({ page: 0, size: 8, sort: 'createdAt,desc' }).subscribe(r => this.newArrivals.set(r.content));
    this.productService.getAll({ badge: 'BESTSELLER', size: 8, page: 0 }).subscribe(r => this.bestSellers.set(r.content));
    this.brandService.getAll(0, 20).subscribe(r => this.brands.set(r.content));
  }
}