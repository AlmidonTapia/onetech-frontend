import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../../../../core/domains/shopping/models/cart.model';
import { ShipmentMethod } from '../../../../../core/domains/shipping/models/shipment.model';
import { ConsigneeInfo } from '../checkout-consignee/checkout-consignee';
import { PaymentMethod } from '../../../../../core/domains/checkout/models/payment.model';

@Component({
  selector: 'app-checkout-aside',
  standalone: true,
  imports: [CurrencyPenPipe, FormsModule],
  templateUrl: './checkout-aside.html'
})
export class CheckoutAsideComponent {
  @Input() cart: Cart | null = null;
  @Input() itemCount: number = 0;
  @Input() subtotal: number = 0;
  @Input() discountAmount: number = 0;
  @Input() shipMethod: ShipmentMethod | null = null;
  @Input() consignee: ConsigneeInfo | null = null;
  @Input() ubigeoCode: string | null = null;
  @Input() locationName: string | null = null;
  @Input() payMethod: PaymentMethod | null = null;
  @Input() finalTotal: number = 0;}
