import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonComponent } from '../button/button';
import { CartService } from '../../../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-to-cart-modal',
  standalone: true,
  imports: [DialogModule, ButtonComponent, DecimalPipe],
  templateUrl: './add-to-cart-modal.html',
  styleUrl: './add-to-cart-modal.css'
})
export class AddToCartModalComponent {
  cartService = inject(CartService);
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
    return this.cartService.addedProductInfo() !== null;
  }

  get addedInfo() {
    return this.cartService.addedProductInfo();
  }

  close() {
    this.cartService.addedProductInfo.set(null);
  }

  goToCart() {
    this.close();
    this.router.navigate(['/cart']);
  }

  continueShopping() {
    this.close();
  }
}
