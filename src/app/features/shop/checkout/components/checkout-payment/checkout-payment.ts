import { Component, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { PaymentService } from '../../../../../core/services/payment.service';
import { PaymentMethod } from '../../../../../core/models/payment.model';

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
      this.methods.set(methods);

      if (methods.length) {
        const currentSelection = methods.find(m => m.idPaymentMethod === this.selectedId()) ?? methods[0];
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
