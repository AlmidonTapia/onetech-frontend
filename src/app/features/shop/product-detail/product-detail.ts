import { Component, OnInit, inject, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductImagesComponent } from './components/product-images/product-images';
import { ProductInfoComponent } from './components/product-info/product-info';
import { ProductReviewsComponent } from './components/product-reviews/product-reviews';
import { ProductReviewFormComponent } from './components/product-review-form/product-review-form';
import { RelatedProductsComponent } from './components/related-products/related-products';
import { SpinnerComponent } from '../../../shared/components/ui/spinner/spinner';
import { BreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/ui/breadcrumb/breadcrumb';
import { ProductService } from '../../../core/domains/catalog/services/product.service';
import { AuthService } from '../../../core/domains/identity/services/auth.service';
import { SeoService } from '../../../core/domains/shared/services/seo.service';
import { Product } from '../../../core/domains/catalog/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    KeyValuePipe,
    ProductImagesComponent,
    ProductInfoComponent,
    ProductReviewsComponent,
    ProductReviewFormComponent,
    RelatedProductsComponent,
    SpinnerComponent,
    BreadcrumbComponent
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  authService = inject(AuthService);
  private seoService = inject(SeoService);

  product = signal<Product | null>(null);
  related = signal<Product[]>([]);
  loading = signal(true);
  breadcrumb = signal<BreadcrumbItem[]>([]);

  apiConfig = {
    relatedPage: 0,
    relatedSize: 5
  };

  content = {
    loadingLabel: 'Cargando producto...',
    catalogLabel: 'Catálogo',
    catalogRoute: '/catalog',
    noCategoryLabel: 'Sin categoría',
    tabs: {
      descriptionLabel: 'Descripción',
      specsLabel: 'Especificaciones',
      reviewsLabel: 'Reseñas',
      noSpecsMsg: 'Este producto no cuenta con especificaciones técnicas detalladas.',
      reviewsLogin: {
        preLink: 'Debes ',
        linkText: 'iniciar sesión',
        postLink: ' para dejar una reseña sobre este producto.'
      }
    }
  };

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id')!;
      this.loadProduct(id);
      
    });
  }

  loadProduct(id: string) {
    this.loading.set(true);
    this.productService.getById(id).subscribe({
      next: p => {
        this.product.set(p);
        this.loading.set(false);

        this.seoService.setMetaData({
          title: p.productName,
          description: p.description || `Compra ${p.productName} en OneTech`,
          image: p.images?.[0]?.imageUrl
        });

        this.breadcrumb.set([
          { label: this.content.catalogLabel, route: this.content.catalogRoute },
          { label: p.categoryName ?? this.content.noCategoryLabel, route: this.content.catalogRoute },
          { label: p.productName },
        ]);

        this.productService.getAll({
          page: this.apiConfig.relatedPage,
          size: this.apiConfig.relatedSize,
          idCategory: p.idCategory
        }).subscribe(r => {
          this.related.set(r.content.filter((rp: any) => rp.idProduct !== id));
        });
      },
      error: () => this.loading.set(false),
    });
  }
}
