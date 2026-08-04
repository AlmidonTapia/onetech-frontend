import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../../../../../core/domains/checkout/models/order.model';
import { CurrencyPenPipe } from '../../../../../../../shared/pipes/currency-pen.pipe';

@Component({
  selector: 'app-order-items',
  standalone: true,
  imports: [CommonModule, CurrencyPenPipe],
  templateUrl: './order-items.html'
})
export class OrderItemsComponent {
  order = input.required<Order>();
  content = input.required<any>();
}
