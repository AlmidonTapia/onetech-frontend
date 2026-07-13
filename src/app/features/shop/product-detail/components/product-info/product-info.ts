import { Component, Input, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent } from '../../../../../shared/components/ui/badge/badge';
import { StarRatingComponent } from '../../../../../shared/components/ui/star-rating/star-rating';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { AlertService } from '../../../../../shared/services/alert.service';
import { CartStore } from '../../../../../core/domains/shopping/store/cart.store';
import { Product } from '../../../../../core/domains/catalog/models/product.model';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [FormsModule, BadgeComponent, ButtonComponent, CurrencyPenPipe],
  templateUrl: './product-info.html',
  styleUrl: './product-info.css'
})
export class ProductInfoComponent {
  private cartStore = inject(CartStore);
  private alertService = inject(AlertService);

  @Input() product!: Product;

  qty = signal(1);
  adding = signal(false);

  content = {
    skuLabel: 'SKU:',
    newBadge: 'Nuevo',
    financingPrefix: 'o 12 cuotas de ',
    badges: {
      bestseller: 'Más vendido',
      offer: 'Oferta'
    },
    stock: {
      availablePrefix: 'En stock (',
      availableSuffix: ' disponibles)',
      availableIcon: 'pi pi-check-circle',
      outLabel: 'Agotado',
      outIcon: 'pi pi-times-circle',
      unavailableLabel: 'No disponible',
      onlyLeftPrefix: '¡Solo ',
      onlyLeftSuffix: ' disponibles!'
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
      errorTitle: 'Error al añadir al carrito',
      linkCopied: 'Enlace copiado al portapapeles'
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
    this.cartStore.addItem({ idProduct: this.product.idProduct, quantity: this.qty() }).subscribe({
      next: () => {
        this.adding.set(false);
      },
      error: (err) => {
        const errMsg = err.error?.message || this.content.alerts.errorTitle;
        this.alertService.error(this.content.alerts.errorTitle, errMsg);
        this.adding.set(false);
      }
    });
  }

  share(platform: 'whatsapp' | 'facebook' | 'copy') {
    const url = window.location.href;
    const text = `¡Mira este producto en OneTech! ${this.product.productName}`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        this.alertService.info(this.content.alerts.linkCopied);
      });
    }
  }
}
