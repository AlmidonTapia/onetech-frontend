import { Component, inject, signal, effect, OnInit, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, switchMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { CheckoutDestinationComponent } from './components/checkout-destination/checkout-destination';
import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment';
import { CheckoutAsideComponent } from './components/checkout-aside/checkout-aside';
import { AlertService } from '../../../shared/services/alert.service';
import { CartStore } from '../../../core/domains/shopping/store/cart.store';
import { OrderService } from '../../../core/domains/checkout/services/order.service';
import { PaymentService } from '../../../core/domains/checkout/services/payment.service';
import { CouponService } from '../../../core/domains/checkout/services/coupon.service';
import { AuthService } from '../../../core/domains/identity/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ShipmentMethod } from '../../../core/domains/shipping/models/shipment.model';
import { PaymentMethod } from '../../../core/domains/checkout/models/payment.model';
import { environment } from '../../../../environments/environment';

import { CheckoutConsigneeComponent, ConsigneeInfo } from './components/checkout-consignee/checkout-consignee';

import { CurrencyPenPipe } from '../../../shared/pipes/currency-pen.pipe';
import { CommonModule } from '@angular/common';

declare var MercadoPago: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ButtonComponent,
    CheckoutDestinationComponent,
    CheckoutShippingComponent,
    CheckoutConsigneeComponent,
    CheckoutPaymentComponent,
    CheckoutAsideComponent,
    FormsModule,
    CurrencyPenPipe,
    CommonModule
  ],
  templateUrl: './checkout.html'
})
export class CheckoutComponent implements OnInit {
  cartStore = inject(CartStore);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private couponService = inject(CouponService);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  currentStep = signal(0);
  placing = signal(false);
  mpBrickReady = signal(false);

  selectedUbigeoCode = signal<string | null>(null);
  selectedLocationName = signal<string | null>(null);
  selectedShipMethod = signal<ShipmentMethod | null>(null);
  selectedConsignee = signal<ConsigneeInfo | null>(null);
  selectedPayMethod = signal<PaymentMethod | null>(null);
  selectedCouponId = signal<string | null>(null);

  couponCode = signal('');
  couponError = signal('');
  discountAmount = signal(0);
  validatingCoupon = signal(false);

  private mpBrickController: any = null;
  get steps() { return ['Destino', 'Envío', 'Datos de Entrega', 'Pago', 'Confirmar']; }

  constructor() {
    effect(() => {
      const step = this.currentStep();
      const method = this.selectedPayMethod();
      if (step === 4 && method?.methodName?.toLowerCase()?.includes('mercado')) {
        this.mpBrickReady.set(false);
        this.loadMpSdk().then(() => {
          setTimeout(() => this.initMercadoPagoBrick(), 200);
        });
      } else if (step !== 4) {
        if (this.mpBrickController) {
          this.mpBrickController.unmount().catch(() => {});
          this.mpBrickController = null;
        }
        this.mpBrickReady.set(false);
      }
    });
  }

  private loadMpSdk(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof MercadoPago !== 'undefined') {
        resolve();
        return;
      }
      const existing = document.getElementById('mp-sdk-script');
      if (existing) {
        if (typeof MercadoPago !== 'undefined') {
          resolve();
        } else {
          existing.addEventListener('load', () => resolve());
        }
        return;
      }
      const script = document.createElement('script');
      script.id = 'mp-sdk-script';
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.onload = () => resolve();
      script.onerror = () => {
        this.alertService.error('SDK bloqueado o no cargado', 'No se pudo cargar el sistema de pago. Desactiva tu bloqueador de anuncios e intenta nuevamente.');
      };
      document.head.appendChild(script);
    });
  }

  ngOnInit() {
    if (this.cartStore.itemCount() === 0) {
      this.alertService.info('Tu carrito está vacío', 'Agrega productos para proceder al pago.');
      this.router.navigate(['/cart']);
    }
  }

  canGoNext(): boolean {
    switch (this.currentStep()) {
      case 0: return !!this.selectedUbigeoCode();
      case 1: return !!this.selectedShipMethod();
      case 2: return !!this.selectedConsignee();
      case 3: return !!this.selectedPayMethod();
      default: return false;
    }
  }

  nextStep() {
    if (this.canGoNext() && this.currentStep() < this.steps.length - 1) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
    }
  }

  onUbigeoSelected(data: import('./components/checkout-destination/checkout-destination').LocationSelection | null) {
    this.selectedUbigeoCode.set(data?.code || null);
    this.selectedLocationName.set(data?.label || null);
    this.selectedShipMethod.set(null);
    this.selectedConsignee.set(null);
  }

  onShipMethodSelected(method: ShipmentMethod | null) {
    this.selectedShipMethod.set(method);
  }

  onConsigneeSelected(consignee: ConsigneeInfo | null) {
    this.selectedConsignee.set(consignee);
  }

  applyCoupon() {
    if (!this.couponCode().trim()) return;
    this.validatingCoupon.set(true);
    this.couponError.set('');
    
    this.couponService.validate(this.couponCode()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (coupon) => {
        this.selectedCouponId.set(coupon.idCoupon);
        if (coupon.discountType === 'FIXED_AMOUNT') {
          this.discountAmount.set(coupon.discountValue);
        } else {
          this.discountAmount.set(this.cartStore.totalAmount() * (coupon.discountValue / 100));
        }
        this.validatingCoupon.set(false);
        this.alertService.success('Cupón aplicado', 'Se ha aplicado el descuento a tu compra.');
      },
      error: (err: any) => {
        this.couponError.set(err?.error?.message || 'Cupón inválido o expirado.');
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
      this.alertService.error('Sesión no válida o expirada. Por favor, inicia sesión de nuevo.');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    if (typeof MercadoPago === 'undefined') {
      this.alertService.error('SDK bloqueado o no cargado', 'El SDK de Mercado Pago no está cargado. Por favor, recarga la página.');
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
            theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default'
          }
        },
        paymentMethods: {
          maxInstallments: 1
        }
      },
      callbacks: {
        onReady: () => {
          this.mpBrickReady.set(true);
        },
        onSubmit: (cardFormData: any) => {
          return new Promise((resolve, reject) => {
            this.executeMpPayment(cardFormData, resolve, reject);
          });
        },
        onError: (error: any) => {
          this.alertService.error('Error del sistema de pago', 'Ocurrió un error al cargar el formulario de pago.');
          this.mpBrickReady.set(false);
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
      this.alertService.error('Error al inicializar el pago', 'No se pudo cargar el formulario de pago seguro. Verifica tu conexión o intenta con otro método de pago.');
    }
  }

  private executeMpPayment(cardFormData: any, resolve: any, reject: any) {
    const cart = this.cartStore.cart();
    if (!cart || !this.selectedUbigeoCode() || !this.selectedPayMethod() || !this.selectedShipMethod()) {
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
      shippingDestination: {
        mode: 'NEW_ADDRESS',
        ubigeoCode: this.selectedUbigeoCode()!,
        consignee: {
          isSelf: this.selectedConsignee()!.isSelf,
          fullName: this.selectedConsignee()!.fullName || undefined,
          docNumber: this.selectedConsignee()!.docNumber || undefined,
          phone: this.selectedConsignee()!.phone || undefined
        }
      },
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
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result: any) => {
        const orderId = result.orderId;
        this.alertService.success(
          '¡Pedido realizado!',
          'Tu pago fue procesado con éxito. Orden #' + orderId.substring(0, 8) + ' confirmada.'
        );
        this.placing.set(false);
        resolve();
        this.router.navigate(['/checkout/success', orderId]);
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || 'Error al procesar el cargo con tu tarjeta.';
        this.alertService.error('Error en el pago', errMsg);
        this.placing.set(false);
        reject();
      }
    });
  }

  placeOrder() {
    const cart = this.cartStore.cart();
    if (!cart || !this.selectedUbigeoCode() || !this.selectedPayMethod() || !this.selectedShipMethod()) return;

    this.placing.set(true);

    const items = cart.items.map(i => ({
      idProduct: i.idProduct,
      quantity: i.quantity,
      unitPrice: i.unitPrice
    }));

    const idempotencyKey = crypto.randomUUID();

    const createOrder$ = this.orderService.create({
      shippingDestination: {
        mode: 'NEW_ADDRESS',
        ubigeoCode: this.selectedUbigeoCode()!,
        consignee: {
          isSelf: this.selectedConsignee()!.isSelf,
          fullName: this.selectedConsignee()!.fullName || undefined,
          docNumber: this.selectedConsignee()!.docNumber || undefined,
          phone: this.selectedConsignee()!.phone || undefined
        }
      },
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
            transactionId: `TXN-${Date.now()}`,
            amountPaid: this.finalTotal,
          }, crypto.randomUUID()) as any,
          cartClear: this.cartStore.clearCart() as any
        });
      })
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result: any) => {
        const orderId = result.orderId;
 
        this.alertService.success(
          '¡Pedido realizado!',
          `${'Orden #'}${orderId.substring(0, 8)}${' confirmada.'}`
        );
        this.placing.set(false);
        this.router.navigate(['/checkout/success', orderId]);
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || 'Error al procesar el pedido o sus servicios secundarios';
        this.alertService.error('Error al generar la orden', errMsg);
        this.placing.set(false);
      }
    });
  }
}

