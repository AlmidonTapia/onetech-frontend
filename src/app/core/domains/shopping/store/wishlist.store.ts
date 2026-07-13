import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState, withHooks } from '@ngrx/signals';
import { HttpClient } from '@angular/common/http';
import { tap, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../identity/services/auth.service';


export interface WishlistItemResponse {
    idWishlistDetail: string;
    idProduct: string;
    productName: string;
    productImageUrl: string;
    unitPrice: number;
    addedAt: string;
}

export interface WishlistResponse {
    idWishlist: string;
    idUser: string;
    items: WishlistItemResponse[];
    totalItems: number;
}

const WISHLIST_KEY = 'onetech_wishlist';

function loadFromStorage(): string[] {
    try {
        return JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]');
    } catch {
        return [];
    }
}

type WishlistState = {
    wishlist: WishlistResponse | null;
    ids: string[];
};

export const WishlistStore = signalStore(
  { providedIn: 'root' },
  withState<WishlistState>({
    wishlist: null,
    ids: loadFromStorage()
  }),
  withComputed(({ ids }) => ({
    count: computed(() => ids().length)
  })),
  withMethods((store, http = inject(HttpClient), auth = inject(AuthService)) => {
    const url = `${environment.apiUrl}/wishlist`;

    const saveToStorage = (newIds: string[]) => {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(newIds));
    };

    return {
      getWishlist(): Observable<WishlistResponse | null> {
        if (auth.isAuthenticated()) {
          return http.get<WishlistResponse>(url).pipe(
            tap(res => {
              patchState(store, { wishlist: res });
              const newIds = res.items.map((i: any) => i.idProduct);
              patchState(store, { ids: newIds });
            })
          );
        }
        return of(null);
      },
      isInWishlist(productId: string): boolean {
        return store.ids().includes(productId);
      },
      toggle(productId: string): boolean {
        const current = store.ids();
        const isAdding = !current.includes(productId);

        if (auth.isAuthenticated()) {
          if (isAdding) {
            http.post(`${url}/items`, { idProduct: productId }).subscribe({
              next: () => this.getWishlist().subscribe(),
              error: () => patchState(store, { ids: current }) // Revert
            });
          } else {
            http.delete(`${url}/items/${productId}`).subscribe({
              next: () => this.getWishlist().subscribe(),
              error: () => patchState(store, { ids: current }) // Revert
            });
          }
          const next = isAdding ? [...current, productId] : current.filter(id => id !== productId);
          patchState(store, { ids: next });
        } else {
          const next = isAdding ? [...current, productId] : current.filter(id => id !== productId);
          patchState(store, { ids: next });
          saveToStorage(next);
        }
        return isAdding;
      },
      remove(productId: string) {
        const current = store.ids();
        if (auth.isAuthenticated()) {
          patchState(store, { ids: current.filter(id => id !== productId) });
          http.delete(`${url}/items/${productId}`).subscribe({
            next: () => this.getWishlist().subscribe(),
            error: () => patchState(store, { ids: current }) // Revert
          });
        } else {
          const next = store.ids().filter(id => id !== productId);
          patchState(store, { ids: next });
          saveToStorage(next);
        }
      },
      clear() {
        if (auth.isAuthenticated()) {
          http.delete(url).subscribe(() => {
            patchState(store, { ids: [], wishlist: null });
          });
        } else {
          patchState(store, { ids: [] });
          localStorage.removeItem(WISHLIST_KEY);
        }
      },
      syncGuestWishlist() {
        const guestIds = loadFromStorage();
        if (guestIds && guestIds.length > 0 && auth.isAuthenticated()) {
          const syncNext = () => {
            if (guestIds.length === 0) {
              localStorage.removeItem(WISHLIST_KEY);
              this.getWishlist().subscribe();
              return;
            }
            const idProduct = guestIds.shift();
            if (idProduct) {
              http.post(`${url}/items`, { idProduct }).subscribe({
                next: () => syncNext(),
                error: () => syncNext()
              });
            }
          };
          syncNext();
        } else if (auth.isAuthenticated()) {
          this.getWishlist().subscribe();
        }
      }
    };
  }),
  withHooks({
    onInit(store, auth = inject(AuthService)) {
      if (auth.isAuthenticated()) {
        setTimeout(() => store.getWishlist().subscribe());
      }
    }
  })
);
