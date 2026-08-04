import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../../../../../core/domains/checkout/models/order.model';
import { CurrencyPenPipe } from '../../../../../../../shared/pipes/currency-pen.pipe';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, CurrencyPenPipe],
  templateUrl: './order-summary.html'
})
export class OrderSummaryComponent {
  order = input.required<Order>();
  content = input.required<any>();
}
