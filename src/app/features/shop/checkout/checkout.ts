import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, switchMap, of } from 'rxjs';

import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { CheckoutSummaryComponent } from './components/checkout-summary/checkout-summary';
import { CheckoutAddressComponent } from './components/checkout-address/checkout-address';
import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment';
import { CheckoutAsideComponent } from './components/checkout-aside/checkout-aside';
import { AlertService } from '../../../shared/services/alert.service';
import { CartStore } from '../../../core/domains/shopping/store/cart.store';
import { OrderService } from '../../../core/domains/checkout/services/order.service';
import { PaymentService } from '../../../core/domains/checkout/services/payment.service';
import { ShipmentService } from '../../../core/domains/shipping/services/shipment.service';
import { CouponService } from '../../../core/domains/checkout/services/coupon.service';
import { AuthService } from '../../../core/domains/identity/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ShipmentMethod } from '../../../core/domains/shipping/models/shipment.model';
import { PaymentMethod } from '../../../core/domains/checkout/models/payment.model';
import { Address } from '../../../core/domains/shipping/models/address.model';
import { environment } from '../../../../environments/environment';

declare var MercadoPago: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ButtonComponent,
    CheckoutAddressComponent,
    CheckoutShippingComponent,
    CheckoutPaymentComponent,
    CheckoutSummaryComponent,
    CheckoutAsideComponent,
    FormsModule
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {
  cartStore = inject(CartStore);
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
    buttons: {
      back: 'Atrás',
      continue: 'Continuar',
      confirmAndPay: 'Confirmar y Pagar',
      apply: 'Aplicar'
    },
    labels: {
      subtotal: 'Subtotal',
      discount: 'Descuento',
      shipping: 'Envío',
      couponPlaceholder: 'Código de descuento'
    },
    navigation: {
      routeSuccess: '/orders',
      txnPrefix: 'TXN-',
      trkPrefix: 'TRK-'
    },
    alerts: {
      successTitle: '¡Pedido realizado!',
      successSub: 'Orden #',
      successEnd: ' confirmada.',
      error: 'Error al procesar el pedido o sus servicios secundarios',
      invalidSession: 'Sesión no válida o expirada. Por favor, inicia sesión de nuevo.',
      sdkNotLoaded: 'El SDK de Mercado Pago no está cargado. Por favor, recarga la página.',
      brickError: 'Ocurrió un error al cargar el formulario de pago.',
      paymentError: 'Error al procesar el cargo con tu tarjeta.',
      couponApplied: 'Cupón aplicado',
      couponAppliedMsg: 'Se ha aplicado el descuento a tu compra.',
      couponInvalid: 'Cupón inválido o expirado.'
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

  ngOnInit() {
    if (this.cartStore.itemCount() === 0) {
      this.alertService.info('Tu carrito está vacío', 'Agrega productos para proceder al pago.');
      this.router.navigate(['/cart']);
    }
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
          this.discountAmount.set(this.cartStore.totalAmount() * (coupon.discountValue / 100));
        }
        this.validatingCoupon.set(false);
        this.alertService.success(this.content.alerts.couponApplied, this.content.alerts.couponAppliedMsg);
      },
      error: (err: any) => {
        this.couponError.set(err?.error?.message || this.content.alerts.couponInvalid);
        this.validatingCoupon.set(false);
        this.selectedCouponId.set(null);
        this.discountAmount.set(0);
      }
    });
  }

  get finalTotal() {
    const subtotal = this.cartStore.totalAmount();
    const shipping = this.selectedShipMethod()?.basePrice ?? 0;
    return Math.max(0, subtotal - this.discountAmount()) + shipping;
  }

  async initMercadoPagoBrick() {
    if (this.mpBrickController) {
      try {
        await this.mpBrickController.unmount();
      } catch (e) {
      }
    }

    const currentUser = this.authService.currentUser();
    if (!currentUser || !currentUser.email) {
      this.alertService.error(this.content.alerts.invalidSession);
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    if (typeof MercadoPago === 'undefined') {
      this.alertService.error(this.content.alerts.sdkNotLoaded);
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
          this.alertService.error(this.content.alerts.brickError);
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
    }
  }

  private executeMpPayment(cardFormData: any, resolve: any, reject: any) {
    const cart = this.cartStore.cart();
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

    const idempotencyKey = crypto.randomUUID();

    this.orderService.create({
      idAddress: this.selectedAddressId()!,
      idShipmentMethod: this.selectedShipMethod()!.idShipmentMethod,
      idCoupon: this.selectedCouponId() ?? undefined,
      items
    }, idempotencyKey).pipe(
      switchMap((orderId: string) => {
        return forkJoin({
          orderId: of(orderId),
          payment: this.paymentService.processMpPayment({
            idOrder: orderId,
            internalPaymentMethodId: this.selectedPayMethod()!.idPaymentMethod,
            token: cardFormData.token,
            transactionAmount: cardFormData.transaction_amount,
            installments: cardFormData.installments,
            paymentMethodId: cardFormData.payment_method_id,
            payerEmail: cardFormData.payer.email
          }, crypto.randomUUID()),
          cartClear: this.cartStore.clearCart()
        });
      })
    ).subscribe({
      next: (result: any) => {
        const orderId = result.orderId;
        this.alertService.success(
          this.content.alerts.successTitle,
          `Tu pago fue procesado con éxito. Orden #${orderId.substring(0, 8)} confirmada.`
        );
        this.placing.set(false);
        resolve();
        this.router.navigate(['/checkout/success', orderId]);
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || this.content.alerts.paymentError;
        this.alertService.error(errMsg);
        this.placing.set(false);
        reject();
      }
    });
  }

  placeOrder() {
    const cart = this.cartStore.cart();
    if (!cart || !this.selectedAddressId() || !this.selectedPayMethod() || !this.selectedShipMethod()) return;

    this.placing.set(true);

    const items = cart.items.map(i => ({
      idProduct: i.idProduct,
      quantity: i.quantity,
      unitPrice: i.unitPrice
    }));

    const idempotencyKey = crypto.randomUUID();

    const createOrder$ = this.orderService.create({
      idAddress: this.selectedAddressId()!,
      idShipmentMethod: this.selectedShipMethod()!.idShipmentMethod,
      idCoupon: this.selectedCouponId() ?? undefined,
      items
    }, idempotencyKey) as any;

    createOrder$.pipe(
      switchMap((orderId: string) => {
        return forkJoin({
          orderId: of(orderId),
          payment: this.paymentService.register({
            idOrder: orderId,
            idPaymentMethod: this.selectedPayMethod()!.idPaymentMethod,
            transactionId: `${this.content.navigation.txnPrefix}${Date.now()}`,
            amountPaid: this.finalTotal,
          }, crypto.randomUUID()) as any,
          cartClear: this.cartStore.clearCart() as any
        });
      })
    ).subscribe({
      next: (result: any) => {
        const orderId = result.orderId;
 
        this.alertService.success(
          this.content.alerts.successTitle,
          `${this.content.alerts.successSub}${orderId.substring(0, 8)}${this.content.alerts.successEnd}`
        );
        this.placing.set(false);
        this.router.navigate(['/checkout/success', orderId]);
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || this.content.alerts.error;
        this.alertService.error(errMsg);
        this.placing.set(false);
      }
    });
  }
}

