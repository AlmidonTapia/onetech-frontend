import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { CurrencyPenPipe } from '../../pipes/currency-pen.pipe';
import { DialogModule } from 'primeng/dialog';
import { CartStore } from '../../../core/domains/shopping/store/cart.store';
import { AlertService } from '../../services/alert.service';
import { WishlistStore } from '../../../core/domains/shopping/store/wishlist.store';
import { Product } from '../../../core/domains/catalog/models/product.model';
import { ProductImagesComponent } from '../../../features/shop/product-detail/components/product-images/product-images';
import { ProductInfoComponent } from '../../../features/shop/product-detail/components/product-info/product-info';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CurrencyPenPipe,
    DialogModule,
    ProductImagesComponent,
    ProductInfoComponent,
    NgOptimizedImage
  ],
  templateUrl: 'product-card.html',
  styleUrl: 'product-card.css'
})
export class ProductCardComponent {
  private router = inject(Router);
  private cartStore = inject(CartStore);
  private alertService = inject(AlertService);
  wishlistStore = inject(WishlistStore);

  @Input() product!: Product;
  @Input() showBrand = true;
  @Output() addedToCart = new EventEmitter<Product>();

  adding = false;
  quickViewOpen = false;

  content = {
    outBadgeLabel: 'Agotado',
    ariaLabels: {
      removeWishlist: 'Quitar de favoritos',
      addWishlist: 'Añadir a favoritos',
      addToCart: 'Añadir al carrito',
      quickView: 'Vista rápida'
    },
    icons: {
      wishlistActive: 'pi-heart-fill',
      wishlistInactive: 'pi-heart',
      cartLoading: 'pi-spin pi-spinner',
      cartDefault: 'pi-cart-plus',
      quickView: 'pi-eye'
    },
    alerts: {
      cartSuccess: 'Añadido al carrito',
      cartError: 'Error al añadir',
      wishlistAdd: 'Añadido a favoritos',
      wishlistRemove: 'Quitado de favoritos'
    }
  };

  get mainImage() {
    return this.product.images?.find(i => i.isPrincipal)?.imageUrl
      ?? this.product.images?.[0]?.imageUrl
      ?? null;
  }

  get discountPercent(): number {
    if (!this.product.originalPrice || this.product.originalPrice <= this.product.price) return 0;
    return Math.round((1 - this.product.price / this.product.originalPrice) * 100);
  }

  navigateToProduct(): void {
    this.router.navigate(['/product', this.product.idProduct]);
  }

  openQuickView(e: Event) {
    e.stopPropagation();
    this.quickViewOpen = true;
  }

  onAddToCart(e: Event) {
    e.stopPropagation();
    this.adding = true;
    this.cartStore.addItem({ idProduct: this.product.idProduct, quantity: 1 }).subscribe({
      next: () => {
        this.adding = false;
        this.addedToCart.emit(this.product);
      },
      error: (err: any) => {
        const errMsg = err.error?.message || this.content.alerts.cartError;
        this.alertService.error(errMsg);
        this.adding = false;
      }
    });
  }

  onToggleWishlist(e: Event) {
    e.stopPropagation();
    const added = this.wishlistStore.toggle(this.product.idProduct);
    this.alertService[added ? 'success' : 'info'](
      added ? this.content.alerts.wishlistAdd : this.content.alerts.wishlistRemove,
      this.product.productName
    );
  }
}