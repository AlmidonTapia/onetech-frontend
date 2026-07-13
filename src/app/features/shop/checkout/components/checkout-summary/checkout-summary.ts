import { Component, Input } from '@angular/core';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { Cart } from '../../../../../core/domains/shopping/models/cart.model';
import { Address } from '../../../../../core/domains/shipping/models/address.model';
import { ShipmentMethod } from '../../../../../core/domains/shipping/models/shipment.model';
import { PaymentMethod } from '../../../../../core/domains/checkout/models/payment.model';

@Component({
  selector: 'app-checkout-summary',
  standalone: true,
  imports: [CurrencyPenPipe],
  templateUrl: './checkout-summary.html',
  styleUrl: './checkout-summary.css'
})
export class CheckoutSummaryComponent {
  @Input() cart: Cart | null = null;
  @Input() address: Address | null = null;
  @Input() shipMethod: ShipmentMethod | null = null;
  @Input() payMethod: PaymentMethod | null = null;
  @Input() discountAmount: number = 0;

  content = {
    blocks: {
      productsTitle: 'Productos',
      productsIcon: 'pi pi-shopping-bag',
      addressTitle: 'Dirección de entrega',
      addressIcon: 'pi pi-map-marker',
      addressEmpty: 'Sin dirección seleccionada',
      shippingTitle: 'Método de envío',
      shippingIcon: 'pi pi-truck',
      shippingEmpty: 'Sin método seleccionado',
      paymentTitle: 'Método de pago',
      paymentIcon: 'pi pi-credit-card',
      paymentEmpty: 'Sin método seleccionado'
    },
    totals: {
      subtotalLabel: 'Subtotal',
      shippingLabel: 'Envío',
      discountLabel: 'Descuento',
      grandTotalLabel: 'Total a pagar'
    }
  };

  get subtotal() { return this.cart?.totalAmount ?? 0; }
  get shipping() { return this.shipMethod?.basePrice ?? 0; }
  get grandTotal() { return Math.max(0, this.subtotal - this.discountAmount) + this.shipping; }
}
