import { Component, inject, signal, effect } from '@angular/core';
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
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ShipmentMethod } from '../../../core/models/shipment.model';
import { PaymentMethod } from '../../../core/models/payment.model';
import { Address } from '../../../core/models/address.model';
import { environment } from '../../../../environments/environment';

declare var MercadoPago: any;

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
  private authService = inject(AuthService);
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

  private mpBrickController: any = null;

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

  constructor() {
    effect(() => {
      const step = this.currentStep();
      const method = this.selectedPayMethod();
      if (step === 3 && method?.methodName?.toLowerCase()?.includes('mercado')) {
        setTimeout(() => {
          this.initMercadoPagoBrick();
        }, 100);
      }
    });
  }

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

  async initMercadoPagoBrick() {
    if (this.mpBrickController) {
      try {
        await this.mpBrickController.unmount();
      } catch (e) {
        console.warn('Error desmontando brick anterior:', e);
      }
    }

    const currentUser = this.authService.currentUser();
    if (!currentUser || !currentUser.email) {
      this.alertService.error('Sesión no válida o expirada. Por favor, inicia sesión de nuevo.');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    if (typeof MercadoPago === 'undefined') {
      this.alertService.error('El SDK de Mercado Pago no está cargado. Por favor, recarga la página.');
      return;
    }

    const mp = new MercadoPago(environment.mpPublicKey, {
      locale: 'es-PE'
    });

    const bricksBuilder = mp.bricks();

    const settings = {
      initialization: {
        amount: this.finalTotal,
        payer: {
          email: currentUser.email,
          entityType: 'individual'
        }
      },
      customization: {
        visual: {
          style: {
            theme: 'default'
          }
        },
        paymentMethods: {
          maxInstallments: 12
        }
      },
      callbacks: {
        onReady: () => {},
        onSubmit: (cardFormData: any) => {
          return new Promise((resolve, reject) => {
            this.executeMpPayment(cardFormData, resolve, reject);
          });
        },
        onError: (error: any) => {
          console.error('Error en Brick:', error);
          this.alertService.error('Ocurrió un error al cargar el formulario de pago.');
        }
      }
    };

    try {
      this.mpBrickController = await bricksBuilder.create(
        'cardPayment',
        'paymentBrick_container',
        settings
      );
    } catch (error) {
      console.error('Error creando el Brick:', error);
    }
  }

  private executeMpPayment(cardFormData: any, resolve: any, reject: any) {
    const cart = this.cartService.cart();
    if (!cart || !this.selectedAddressId() || !this.selectedPayMethod() || !this.selectedShipMethod()) {
      reject();
      return;
    }

    this.placing.set(true);

    const items = cart.items.map(i => ({
      idProduct: i.idProduct,
      quantity: i.quantity,
      unitPrice: i.unitPrice
    }));

    this.orderService.create({
      idAddress: this.selectedAddressId()!,
      idShipmentMethod: this.selectedShipMethod()!.idShipmentMethod,
      idCoupon: this.selectedCouponId() ?? undefined,
      items
    }).pipe(
      switchMap((order: any) => {
        return forkJoin({
          order: of(order),
          payment: this.paymentService.processMpPayment({
            idOrder: order.id,
            internalPaymentMethodId: this.selectedPayMethod()!.idPaymentMethod,
            token: cardFormData.token,
            transactionAmount: cardFormData.transaction_amount,
            installments: cardFormData.installments,
            paymentMethodId: cardFormData.payment_method_id,
            payerEmail: cardFormData.payer.email
          }),
          cartClear: this.cartService.clearCart()
        });
      })
    ).subscribe({
      next: (result: any) => {
        const order = result.order;
        this.alertService.success(
          this.content.alerts.successTitle,
          `Tu pago fue procesado con éxito. Orden #${order.id.substring(0, 8)} confirmada.`
        );
        this.placing.set(false);
        resolve();
        this.router.navigate([this.content.navigation.routeSuccess]);
      },
      error: (err: any) => {
        console.error('Error al procesar el pago de Mercado Pago:', err);
        const errMsg = err?.error?.message || 'Error al procesar el cargo con tu tarjeta.';
        this.alertService.error(errMsg);
        this.placing.set(false);
        reject();
      }
    });
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
