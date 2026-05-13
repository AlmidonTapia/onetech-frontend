import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Cart, AddToCartRequest } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/cart`;

  cart = signal<Cart | null>(null);
  itemCount = computed(() => this.cart()?.items?.length ?? 0);
  totalAmount = computed(() => this.cart()?.totalAmount ?? 0);

  getCart() {
    return this.http.get<Cart>(this.url).pipe(
      tap(cart => this.cart.set(cart))
    );
  }

  addItem(data: AddToCartRequest) {
    return this.http.post<Cart>(`${this.url}/items`, data).pipe(
      tap(cart => this.cart.set(cart))
    );
  }

  updateItem(itemId: string, quantity: number) {
    return this.http.patch<Cart>(`${this.url}/items/${itemId}`, { quantity }).pipe(
      tap(cart => this.cart.set(cart))
    );
  }

  removeItem(itemId: string) {
    return this.http.delete<Cart>(`${this.url}/items/${itemId}`).pipe(
      tap(cart => this.cart.set(cart))
    );
  }

  clearCart() {
    return this.http.delete<void>(this.url).pipe(
      tap(() => this.cart.set(null))
    );
  }
}
