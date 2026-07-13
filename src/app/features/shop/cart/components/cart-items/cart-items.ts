import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { CartItem } from '../../../../../core/domains/shopping/models/cart.model';

@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [RouterLink, CurrencyPenPipe],
  templateUrl: './cart-items.html',
  styleUrl: './cart-items.css'
})
export class CartItemsComponent {
  @Input() items: CartItem[] = [];
  @Output() updateQty = new EventEmitter<{ id: string; qty: number }>();
  @Output() removeItem = new EventEmitter<string>();
}