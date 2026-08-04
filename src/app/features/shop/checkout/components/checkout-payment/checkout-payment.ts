import { Component, Output, EventEmitter, OnInit, inject, signal, Input, DestroyRef } from '@angular/core';
import { PaymentService } from '../../../../../core/domains/checkout/services/payment.service';
import { PaymentMethod } from '../../../../../core/domains/checkout/models/payment.model';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [FormsModule, ButtonComponent, CommonModule],
  templateUrl: './checkout-payment.html'
})
export class CheckoutPaymentComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private destroyRef = inject(DestroyRef);
  @Output() selected = new EventEmitter<PaymentMethod>();

  methods = signal<PaymentMethod[]>([]);
  selectedId = signal<string | null>(null);
  
  @Input() selectedCouponId: string | null = null;
  @Input() validatingCoupon: boolean = false;
  @Input() couponError: string = '';
  @Input() discountAmount: number = 0;
  @Output() applyCoupon = new EventEmitter<string>();

  couponCode = '';
  ngOnInit() {
    this.paymentService.getMethods().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(methods => {
      const activeMethods = methods.filter(m => m.status === 'ACTIVO');
      this.methods.set(activeMethods);

      if (activeMethods.length) {
        const currentSelection = activeMethods.find(m => m.idPaymentMethod === this.selectedId()) ?? activeMethods[0];
        this.selectedId.set(currentSelection.idPaymentMethod);
        this.selected.emit(currentSelection);
      }
    });
  }

  select(method: PaymentMethod) {
    this.selectedId.set(method.idPaymentMethod);
    this.selected.emit(method);
  }

  onApplyCoupon() {
    if (this.couponCode.trim()) {
      this.applyCoupon.emit(this.couponCode);
    }
  }
}
