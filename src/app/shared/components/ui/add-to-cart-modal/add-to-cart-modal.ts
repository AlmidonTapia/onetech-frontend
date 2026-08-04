import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonComponent } from '../button/button';
import { CartStore } from '../../../../core/domains/shopping/store/cart.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-to-cart-modal',
  standalone: true,
  imports: [DialogModule, ButtonComponent, DecimalPipe],
  templateUrl: './add-to-cart-modal.html'
})
export class AddToCartModalComponent {
  cartStore = inject(CartStore);
  private router = inject(Router);

  content = {
    title: '¡Agregado a tu carrito!',
    quantityLabel: 'Cantidad:',
    buttons: {
      continueShopping: 'Seguir comprando',
      goToCart: 'Ir al carrito'
    }
  };

  get visible() {
    return this.cartStore.addedProductInfo() !== null;
  }

  get addedInfo() {
    return this.cartStore.addedProductInfo();
  }

  close() {
    this.cartStore.clearAddedProductInfo();
  }

  goToCart() {
    this.close();
    this.router.navigate(['/cart']);
  }

  continueShopping() {
    this.close();
  }
}
