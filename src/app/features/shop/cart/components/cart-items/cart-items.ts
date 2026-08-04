import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPenPipe } from '../../../../../shared/pipes/currency-pen.pipe';
import { CartItem } from '../../../../../core/domains/shopping/models/cart.model';


import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-cart-items',
  standalone: true,
  imports: [RouterLink, CurrencyPenPipe, ButtonComponent],
  templateUrl: './cart-items.html'
})
export class CartItemsComponent {
  @Input() items: CartItem[] = [];
  @Output() updateQty = new EventEmitter<{ id: string; qty: number }>();
  @Output() removeItem = new EventEmitter<string>();}