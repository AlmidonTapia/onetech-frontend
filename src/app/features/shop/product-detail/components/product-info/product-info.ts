import { Component, Input, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../../../shared/components/ui/badge/badge';
import { StarRatingComponent } from '../../../../../shared/components/ui/star-rating/star-rating';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { AlertService } from '../../../../../shared/services/alert.service';
import { CartService } from '../../../../../core/services/cart.service';
import { Product } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [FormsModule, BadgeComponent, StarRatingComponent, ButtonComponent, CurrencyPenPipe],
  templateUrl: './product-info.html',
  styleUrl: './product-info.css'
})
export class ProductInfoComponent {
  private cartService = inject(CartService);
  private alertService = inject(AlertService);

  @Input() product!: Product;

  qty = signal(1);
  adding = signal(false);

  content = {
    skuLabel: 'SKU:',
    newBadge: 'Nuevo',
    financingPrefix: 'o 12 cuotas de ',
    stock: {
      availablePrefix: 'En stock (',
      availableSuffix: ' disponibles)',
      availableIcon: 'pi pi-check-circle',
      outLabel: 'Agotado',
      outIcon: 'pi pi-times-circle'
    },
    actions: {
      addToCartLabel: 'Añadir al carrito',
      addToCartIcon: 'pi-cart-plus'
    },
    shippingPerks: [
      { icon: 'pi pi-truck', text: 'Envío gratis desde S/ 199' },
      { icon: 'pi pi-shield', text: 'Garantía de 1 año' },
      { icon: 'pi pi-refresh', text: '30 días para devoluciones' }
    ],
    alerts: {
      successTitle: 'Añadido al carrito',
      errorTitle: 'Error al añadir al carrito'
    }
  };

  getDiscountPercent(): number {
    if (!this.product.originalPrice || this.product.originalPrice <= this.product.price) return 0;
    return Math.round((1 - this.product.price / this.product.originalPrice) * 100);
  }

  changeQty(delta: number) {
    const next = this.qty() + delta;
    if (next >= 1 && next <= this.product.stockQuantity) this.qty.set(next);
  }

  addToCart() {
    this.adding.set(true);
    this.cartService.addItem({ idProduct: this.product.idProduct, quantity: this.qty() }).subscribe({
      next: () => {
        this.adding.set(false);
      },
      error: () => {
        this.alertService.error(this.content.alerts.errorTitle);
        this.adding.set(false);
      }
    });
  }
}
