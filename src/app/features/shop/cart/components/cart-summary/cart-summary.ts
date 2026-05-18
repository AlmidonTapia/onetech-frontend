import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [RouterLink, ButtonComponent, CurrencyPenPipe],
  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.css'
})
export class CartSummaryComponent {
  @Input() totalAmount = 0;
  @Input() itemCount = 0;
  @Output() checkout = new EventEmitter<void>();

  shippingConfig = {
    freeThreshold: 199,
    freeLabel: 'Gratis',
    calculatingLabel: 'A calcular'
  };

  content = {
    title: 'Resumen del pedido',
    subtotalLabel: 'Subtotal',
    singularProduct: 'producto',
    pluralProduct: 'productos',
    shippingLabel: 'Envío',
    totalLabel: 'Total',
    checkoutBtnLabel: 'Proceder al pago',
    checkoutBtnIcon: 'pi-lock',
    continueShoppingText: 'Seguir comprando',
    continueShoppingRoute: '/catalog',
    paymentMethodsTitle: 'Aceptamos:',
    paymentMethods: ['Visa', 'Mastercard', 'Yape', 'Plin']
  };
}
