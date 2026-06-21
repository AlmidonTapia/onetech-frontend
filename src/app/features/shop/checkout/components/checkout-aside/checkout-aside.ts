import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../../../../core/models/cart.model';
import { ShipmentMethod } from '../../../../../core/models/shipment.model';

@Component({
  selector: 'app-checkout-aside',
  standalone: true,
  imports: [CurrencyPenPipe, ButtonComponent, FormsModule],
  templateUrl: './checkout-aside.html',
  styleUrl: './checkout-aside.css'
})
export class CheckoutAsideComponent {
  @Input() cart: Cart | null = null;
  @Input() itemCount: number = 0;
  @Input() subtotal: number = 0;
  @Input() discountAmount: number = 0;
  @Input() shipMethod: ShipmentMethod | null = null;
  @Input() finalTotal: number = 0;
  @Input() selectedCouponId: string | null = null;
  @Input() validatingCoupon: boolean = false;
  @Input() couponError: string = '';
  
  @Output() applyCoupon = new EventEmitter<string>();

  couponCode = '';

  content = {
    summaryTitle: 'Tu pedido',
    totalLabel: 'Total',
    labels: {
      subtotal: 'Subtotal',
      discount: 'Descuento',
      shipping: 'Envío',
      couponPlaceholder: 'Código de descuento'
    },
    buttons: {
      apply: 'Aplicar'
    }
  };

  onApplyCoupon() {
    if (this.couponCode.trim()) {
      this.applyCoupon.emit(this.couponCode);
    }
  }
}
