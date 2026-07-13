import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState, withHooks } from '@ngrx/signals';
import { HttpClient } from '@angular/common/http';
import { tap, of, Observable } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { Cart, AddToCartRequest, CartItem } from '../models/cart.model';
import { AuthService } from '../../identity/services/auth.service';
import { ProductService } from '../../catalog/services/product.service';

const GUEST_CART_KEY = 'onetech_guest_cart';

function loadGuestCart(): Cart | null {
  const data = localStorage.getItem(GUEST_CART_KEY);
  return data ? JSON.parse(data) : null;
}

type CartState = {
  cart: Cart | null;
  addedProductInfo: { product: any; quantity: number } | null;
};

const initialState: CartState = {
  cart: loadGuestCart(),
  addedProductInfo: null
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ cart }) => ({
    itemCount: computed(() => cart()?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0),
    totalAmount: computed(() => cart()?.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0) ?? 0)
  })),
  withMethods((store, http = inject(HttpClient), auth = inject(AuthService), prod = inject(ProductService)) => {
    const url = `${environment.apiUrl}/cart`;

    const updateCartLocal = (newCart: Cart) => {
      patchState(store, { cart: { ...newCart } });
      if (!auth.isAuthenticated()) {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
      }
    };

    return {
      getCart(): Observable<Cart | null> {
        if (auth.isAuthenticated()) {
          return http.get<Cart>(url).pipe(
            tap(cart => updateCartLocal(cart))
          );
        }
        return of(store.cart());
      },
      addItem(data: AddToCartRequest): Observable<any> {
        if (auth.isAuthenticated()) {
          return http.post<void>(`${url}/items`, data).pipe(
            tap(() => {
              http.get<Cart>(url).subscribe(cart => updateCartLocal(cart));
              prod.getById(data.idProduct).subscribe((product: any) => {
                patchState(store, { addedProductInfo: { product, quantity: data.quantity } });
              });
            })
          );
        } else {
          return prod.getById(data.idProduct).pipe(
            tap((product: any) => {
              const currentCart = store.cart() ? { ...store.cart()! } : { idCart: 'guest', idUser: 'guest', items: [], totalAmount: 0 } as Cart;
              const existingItem = currentCart.items.find(i => i.idProduct === data.idProduct);

              if (existingItem) {
                existingItem.quantity += data.quantity;
                existingItem.subtotal = existingItem.quantity * existingItem.unitPrice;
              } else {
                currentCart.items.push({
                  idCartDetail: 'guest_' + Date.now(),
                  idProduct: product.idProduct,
                  productName: product.productName,
                  unitPrice: product.price,
                  quantity: data.quantity,
                  subtotal: product.price * data.quantity
                });
              }
              updateCartLocal(currentCart);
              patchState(store, { addedProductInfo: { product, quantity: data.quantity } });
            })
          );
        }
      },
      removeItem(productId: string): Observable<any> {
        if (auth.isAuthenticated()) {
          return http.delete<void>(`${url}/items/${productId}`).pipe(
            tap(() => http.get<Cart>(url).subscribe(cart => updateCartLocal(cart)))
          );
        } else {
          const currentCart = store.cart() ? { ...store.cart()! } : null;
          if (currentCart) {
            currentCart.items = currentCart.items.filter(i => i.idProduct !== productId);
            updateCartLocal(currentCart);
          }
          return of(null);
        }
      },
      updateQuantity(productId: string, quantity: number): Observable<any> {
        if (auth.isAuthenticated()) {
          return http.patch(`${url}/items/${productId}`, { quantity }).pipe(
            tap(() => http.get<Cart>(url).subscribe(cart => updateCartLocal(cart)))
          );
        } else {
          const currentCart = store.cart() ? { ...store.cart()! } : null;
          if (currentCart) {
            const item = currentCart.items.find(i => i.idProduct === productId);
            if (item) {
              item.quantity = quantity;
              item.subtotal = item.quantity * item.unitPrice;
              updateCartLocal(currentCart);
            }
          }
          return of(null);
        }
      },
      clearAddedProductInfo() {
        patchState(store, { addedProductInfo: null });
      },
      clearCart(): Observable<any> {
        localStorage.removeItem(GUEST_CART_KEY);
        patchState(store, { cart: null });
        if (auth.isAuthenticated()) {
          return http.delete<void>(url);
        }
        return of(null);
      },
      syncGuestCart() {
        const guestCart = loadGuestCart();
        if (guestCart && guestCart.items.length > 0 && auth.isAuthenticated()) {
          const batchItems = guestCart.items.map(item => ({ idProduct: item.idProduct, quantity: item.quantity }));
          http.post(`${url}/items/batch`, { items: batchItems }).subscribe({
            next: () => {
              localStorage.removeItem(GUEST_CART_KEY);
              http.get<Cart>(url).subscribe(cart => updateCartLocal(cart));
            },
            error: () => {
              localStorage.removeItem(GUEST_CART_KEY);
              http.get<Cart>(url).subscribe(cart => updateCartLocal(cart));
            }
          });
        }
      }
    };
  }),
  withHooks({
    onInit(store, auth = inject(AuthService)) {
      if (auth.isAuthenticated()) {
        setTimeout(() => store.getCart().subscribe());
      }
    }
  })
);
