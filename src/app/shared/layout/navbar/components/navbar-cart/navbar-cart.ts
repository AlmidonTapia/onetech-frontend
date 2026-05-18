import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../../core/services/cart.service';
import { CurrencyPenPipe } from '../../../../pipes/currency-pen.pipe';

@Component({
  selector: 'app-navbar-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPenPipe],
  templateUrl: './navbar-cart.html',
  styleUrl: './navbar-cart.css'
})
export class NavbarCartComponent {
  private cartService = inject(CartService);

  itemCount = this.cartService.itemCount;
  totalAmount = this.cartService.totalAmount;

  content = {
    cartRoute: '/cart',
    ariaLabelCart: 'Ver carrito',
    cartIcon: 'pi pi-shopping-cart',
    labelText: 'Carrito'
  };
}
