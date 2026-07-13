import { Component, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { PaymentService } from '../../../../../core/domains/checkout/services/payment.service';
import { PaymentMethod } from '../../../../../core/domains/checkout/models/payment.model';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [],
  templateUrl: './checkout-payment.html',
  styleUrl: './checkout-payment.css'
})
export class CheckoutPaymentComponent implements OnInit {
  private paymentService = inject(PaymentService);
  @Output() selected = new EventEmitter<PaymentMethod>();

  methods = signal<PaymentMethod[]>([]);
  selectedId = signal<string | null>(null);

  content = {
    title: 'Método de pago',
    titleIcon: 'pi pi-credit-card'
  };

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
}
