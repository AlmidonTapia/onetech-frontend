import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, of, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cart, AddToCartRequest, CartItem } from '../models/cart.model';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private url = `${environment.apiUrl}/cart`;
  private readonly GUEST_CART_KEY = 'onetech_guest_cart';

  cart = signal<Cart | null>(this.loadGuestCart());
  itemCount = computed(() => this.cart()?.items?.length ?? 0);
  totalAmount = computed(() => {
    return this.cart()?.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0) ?? 0;
  });

  constructor() {
    // If authenticated on startup, fetch from server
    if (this.authService.isAuthenticated()) {
      this.getCart().subscribe();
    }
  }

  getCart(): Observable<Cart | null> {
    if (this.authService.isAuthenticated()) {
      return this.http.get<Cart>(this.url).pipe(
        tap(cart => this.updateCartSignal(cart))
      );
    }
    return of(this.cart());
  }

  addItem(data: AddToCartRequest): Observable<any> {
    if (this.authService.isAuthenticated()) {
      return this.http.post<Cart>(`${this.url}/items`, data).pipe(
        tap(() => this.getCart().subscribe())
      );
    } else {
      // Guest logic: fetch product details to store them locally
      return this.productService.getById(data.idProduct).pipe(
        tap(product => {
          const currentCart = this.cart() || { idCart: 'guest', idUser: 'guest', items: [], totalAmount: 0 };
          const existingItem = currentCart.items.find(i => i.idProduct === data.idProduct);

          if (existingItem) {
            existingItem.quantity += data.quantity;
            existingItem.subtotal = existingItem.quantity * existingItem.unitPrice;
          } else {
            const newItem: CartItem = {
              idCartDetail: 'guest_' + Date.now(),
              idProduct: product.idProduct,
              productName: product.productName,
              unitPrice: product.price,
              quantity: data.quantity,
              subtotal: product.price * data.quantity
            };
            currentCart.items.push(newItem);
          }
          this.updateCartSignal(currentCart);
        })
      );
    }
  }

  removeItem(productId: string): Observable<any> {
    if (this.authService.isAuthenticated()) {
      return this.http.delete<Cart>(`${this.url}/items/${productId}`).pipe(
        tap(() => this.getCart().subscribe())
      );
    } else {
      const currentCart = this.cart();
      if (currentCart) {
        currentCart.items = currentCart.items.filter(i => i.idProduct !== productId);
        this.updateCartSignal(currentCart);
      }
      return of(null);
    }
  }

  updateQuantity(productId: string, quantity: number): Observable<any> {
    if (this.authService.isAuthenticated()) {
      // Assuming backend has a patch/put for quantity
      return this.http.patch(`${this.url}/items/${productId}`, { quantity }).pipe(
        tap(() => this.getCart().subscribe())
      );
    } else {
      const currentCart = this.cart();
      if (currentCart) {
        const item = currentCart.items.find(i => i.idProduct === productId);
        if (item) {
          item.quantity = quantity;
          item.subtotal = item.quantity * item.unitPrice;
          this.updateCartSignal(currentCart);
        }
      }
      return of(null);
    }
  }

  syncGuestCart() {
    const guestCart = this.loadGuestCart();
    if (guestCart && guestCart.items.length > 0 && this.authService.isAuthenticated()) {
      // Synchronize each item to the server
      guestCart.items.forEach(item => {
        this.addItem({ idProduct: item.idProduct, quantity: item.quantity }).subscribe();
      });
      localStorage.removeItem(this.GUEST_CART_KEY);
    }
  }

  private updateCartSignal(newCart: Cart) {
    this.cart.set({ ...newCart });
    if (!this.authService.isAuthenticated()) {
      localStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(newCart));
    }
  }

  private loadGuestCart(): Cart | null {
    const data = localStorage.getItem(this.GUEST_CART_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearCart() {
    localStorage.removeItem(this.GUEST_CART_KEY);
    this.cart.set(null);
    if (this.authService.isAuthenticated()) {
      return this.http.delete<void>(this.url);
    }
    return of(null);
  }
}
