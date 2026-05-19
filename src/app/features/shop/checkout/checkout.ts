import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, switchMap, of } from 'rxjs';
import { CurrencyPenPipe } from '../../../shared/pipes/currency-pen.pipe';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { CheckoutSummaryComponent } from './components/checkout-summary/checkout-summary';
import { CheckoutAddressComponent } from './components/checkout-address/checkout-address';
import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment';
import { AlertService } from '../../../shared/services/alert.service';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { PaymentService } from '../../../core/services/payment.service';
import { ShipmentService } from '../../../core/services/shipment.service';
import { CouponService } from '../../../core/services/coupon.service';
import { FormsModule } from '@angular/forms';
import { ShipmentMethod } from '../../../core/models/shipment.model';
import { PaymentMethod } from '../../../core/models/payment.model';
import { Address } from '../../../core/models/address.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CurrencyPenPipe,
    ButtonComponent,
    CheckoutAddressComponent,
    CheckoutShippingComponent,
    CheckoutPaymentComponent,
    CheckoutSummaryComponent,
    FormsModule
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private shipmentService = inject(ShipmentService);
  private couponService = inject(CouponService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  currentStep = signal(0);
  placing = signal(false);

  selectedAddressId = signal<string | null>(null);
  selectedAddress = signal<Address | null>(null);
  selectedShipMethod = signal<ShipmentMethod | null>(null);
  selectedPayMethod = signal<PaymentMethod | null>(null);
  selectedCouponId = signal<string | null>(null);

  couponCode = signal('');
  couponError = signal('');
  discountAmount = signal(0);
  validatingCoupon = signal(false);

  content = {
    steps: ['Dirección', 'Envío', 'Pago', 'Confirmar'],
    summaryTitle: 'Tu pedido',
    totalLabel: 'Total',
    navigation: {
      routeSuccess: '/orders',
      txnPrefix: 'TXN-',
      trkPrefix: 'TRK-'
    },
    alerts: {
      successTitle: '¡Pedido realizado!',
      successSub: 'Orden #',
      successEnd: ' confirmada.',
      error: 'Error al procesar el pedido o sus servicios secundarios'
    }
  };

  readonly steps = this.content.steps;

  onAddressSelected(address: Address) {
    this.selectedAddressId.set(address.idAddress);
    this.selectedAddress.set(address);
  }

  canGoNext(): boolean {
    if (this.currentStep() === 0) return !!this.selectedAddressId();
    if (this.currentStep() === 1) return !!this.selectedShipMethod();
    if (this.currentStep() === 2) return !!this.selectedPayMethod();
    return true;
  }

  next() { if (this.canGoNext() && this.currentStep() < 3) this.currentStep.update(s => s + 1); }
  prev() { if (this.currentStep() > 0) this.currentStep.update(s => s - 1); }

  applyCoupon() {
    if (!this.couponCode().trim()) return;
    this.validatingCoupon.set(true);
    this.couponError.set('');
    
    this.couponService.validate(this.couponCode()).subscribe({
      next: (coupon) => {
        this.selectedCouponId.set(coupon.idCoupon);
        if (coupon.discountType === 'FIXED_AMOUNT') {
          this.discountAmount.set(coupon.discountValue);
        } else {
          this.discountAmount.set(this.cartService.totalAmount() * (coupon.discountValue / 100));
        }
        this.validatingCoupon.set(false);
        this.alertService.success('Cupón aplicado', 'Se ha aplicado el descuento a tu compra.');
      },
      error: () => {
        this.couponError.set('Cupón inválido o expirado.');
        this.validatingCoupon.set(false);
        this.selectedCouponId.set(null);
        this.discountAmount.set(0);
      }
    });
  }

  get finalTotal() {
    return Math.max(0, this.cartService.totalAmount() - this.discountAmount());
  }

  placeOrder() {
    const cart = this.cartService.cart();
    if (!cart || !this.selectedAddressId() || !this.selectedPayMethod() || !this.selectedShipMethod()) return;

    this.placing.set(true);

    const items = cart.items.map(i => ({
      idProduct: i.idProduct,
      quantity: i.quantity,
      unitPrice: i.unitPrice
    }));

    const createOrder$ = this.orderService.create({
      idAddress: this.selectedAddressId()!,
      idShipmentMethod: this.selectedShipMethod()!.idShipmentMethod,
      idCoupon: this.selectedCouponId() ?? undefined,
      items
    }) as any;

    createOrder$.pipe(
      switchMap((order: any) => {
        return forkJoin({
          order: of(order),
          payment: this.paymentService.register({
            idOrder: order.id,
            idPaymentMethod: this.selectedPayMethod()!.idPaymentMethod,
            transactionId: `${this.content.navigation.txnPrefix}${Date.now()}`,
            amountPaid: this.finalTotal,
          }) as any,
          cartClear: this.cartService.clearCart() as any
        });
      })
    ).subscribe({
      next: (result: any) => {
        const order = result.order;
 
        this.alertService.success(
          this.content.alerts.successTitle,
          `${this.content.alerts.successSub}${order.id.substring(0, 8)}${this.content.alerts.successEnd}`
        );
        this.placing.set(false);
        this.router.navigate([this.content.navigation.routeSuccess]);
      },
      error: () => {
        this.alertService.error(this.content.alerts.error);
        this.placing.set(false);
      }
    });
  }
}
