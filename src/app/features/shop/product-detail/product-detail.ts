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
import { WhatsappBtnComponent } from '../../../shared/components/ui/whatsapp-btn/whatsapp-btn';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';

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
    BreadcrumbComponent,
    WhatsappBtnComponent
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  authService = inject(AuthService);

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
      noSpecsMsg: 'Este producto no cuenta con especificaciones técnicas detalladas.'
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
          this.related.set(r.content.filter(rp => rp.idProduct !== id));
        });
      },
      error: () => this.loading.set(false),
    });
  }
}
