import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPenPipe } from '../../pipes/currency-pen.pipe';
import { StarRatingComponent } from '../ui/star-rating/star-rating';
import { CartService } from '../../../core/services/cart.service';
import { AlertService } from '../../services/alert.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPenPipe, StarRatingComponent],
  templateUrl: 'product-card.html',
  styleUrl: 'product-card.css'
})
export class ProductCardComponent {
  private cartService = inject(CartService);
  private alertService = inject(AlertService);
  wishlistService = inject(WishlistService);

  @Input() product!: Product;
  @Input() showBrand = true;
  @Output() addedToCart = new EventEmitter<Product>();

  adding = false;

  content = {
    outBadgeLabel: 'Agotado',
    ariaLabels: {
      removeWishlist: 'Quitar de favoritos',
      addWishlist: 'Añadir a favoritos',
      addToCart: 'Añadir al carrito'
    },
    icons: {
      wishlistActive: 'pi-heart-fill',
      wishlistInactive: 'pi-heart',
      cartLoading: 'pi-spin pi-spinner',
      cartDefault: 'pi-cart-plus'
    },
    alerts: {
      cartSuccess: 'Añadido al carrito',
      cartError: 'Error al añadir',
      wishlistAdd: 'Añañido a favoritos',
      wishlistRemove: 'Quitado de favoritos'
    }
  };

  get mainImage() {
    return this.product.images?.find(i => i.isPrincipal)?.imageUrl
      ?? this.product.images?.[0]?.imageUrl
      ?? null;
  }

  onAddToCart(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.adding = true;
    this.cartService.addItem({ idProduct: this.product.idProduct, quantity: 1 }).subscribe({
      next: () => {
        this.alertService.success(this.content.alerts.cartSuccess, this.product.productName);
        this.adding = false;
        this.addedToCart.emit(this.product);
      },
      error: () => {
        this.alertService.error(this.content.alerts.cartError);
        this.adding = false;
      }
    });
  }

  onToggleWishlist(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    const added = this.wishlistService.toggle(this.product.idProduct);

    this.alertService[added ? 'success' : 'info'](
      added ? this.content.alerts.wishlistAdd : this.content.alerts.wishlistRemove,
      this.product.productName
    );
  }
}
