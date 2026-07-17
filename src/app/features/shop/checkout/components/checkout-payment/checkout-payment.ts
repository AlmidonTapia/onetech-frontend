import { Component, Output, EventEmitter, OnInit, inject, signal, Input } from '@angular/core';
import { PaymentService } from '../../../../../core/domains/checkout/services/payment.service';
import { PaymentMethod } from '../../../../../core/domains/checkout/models/payment.model';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { TranslationService } from '../../../../../core/services/translation.service';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  templateUrl: './checkout-payment.html',
  styleUrl: './checkout-payment.css'
})
export class CheckoutPaymentComponent implements OnInit {
  private paymentService = inject(PaymentService);
  @Output() selected = new EventEmitter<PaymentMethod>();

  methods = signal<PaymentMethod[]>([]);
  selectedId = signal<string | null>(null);
  
  @Input() selectedCouponId: string | null = null;
  @Input() validatingCoupon: boolean = false;
  @Input() couponError: string = '';
  @Input() discountAmount: number = 0;
  @Output() applyCoupon = new EventEmitter<string>();

  couponCode = '';

  ts = inject(TranslationService);
  t = this.ts.t;

  ngOnInit() {
    this.paymentService.getMethods().subscribe(methods => {
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
