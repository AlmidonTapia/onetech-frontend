import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { tap, Observable, of } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class WishlistService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private url = `${environment.apiUrl}/wishlist`;
    private readonly KEY = 'onetech_wishlist';
    
    private _ids = signal<string[]>(this.loadFromStorage());
    wishlist = signal<WishlistResponse | null>(null);

    ids = this._ids.asReadonly();
    count = computed(() => this._ids().length);

    constructor() {
        if (this.authService.isAuthenticated()) {
            setTimeout(() => {
                this.getWishlist().subscribe();
            });
        }
    }

    getWishlist(): Observable<WishlistResponse | null> {
        if (this.authService.isAuthenticated()) {
            return this.http.get<WishlistResponse>(this.url).pipe(
                tap(res => {
                    this.wishlist.set(res);
                    const newIds = res.items.map(i => i.idProduct);
                    this._ids.set(newIds);
                })
            );
        }
        return of(null);
    }

    isInWishlist(productId: string): boolean {
        return this._ids().includes(productId);
    }

    toggle(productId: string): boolean {
        const current = this._ids();
        const idx = current.indexOf(productId);
        const isAdding = idx === -1;

        if (this.authService.isAuthenticated()) {
            if (isAdding) {
                this.http.post(`${this.url}/items`, { idProduct: productId }).subscribe(() => this.getWishlist().subscribe());
            } else {
                this.http.delete(`${this.url}/items/${productId}`).subscribe(() => this.getWishlist().subscribe());
            }
            // Optimistic update
            let next: string[];
            if (isAdding) next = [...current, productId];
            else next = current.filter(id => id !== productId);
            this._ids.set(next);
        } else {
            let next: string[];
            if (isAdding) {
                next = [...current, productId];
            } else {
                next = current.filter(id => id !== productId);
            }
            this._ids.set(next);
            this.saveToStorage(next);
        }
        return isAdding;
    }

    remove(productId: string) {
        if (this.authService.isAuthenticated()) {
            this.http.delete(`${this.url}/items/${productId}`).subscribe(() => this.getWishlist().subscribe());
            // Optimistic update
            this._ids.update(ids => ids.filter(id => id !== productId));
        } else {
            const next = this._ids().filter(id => id !== productId);
            this._ids.set(next);
            this.saveToStorage(next);
        }
    }

    clear() {
        if (this.authService.isAuthenticated()) {
            this.http.delete(this.url).subscribe(() => {
                this._ids.set([]);
                this.wishlist.set(null);
            });
            // Optimistic update
            this._ids.set([]);
        } else {
            this._ids.set([]);
            localStorage.removeItem(this.KEY);
        }
    }

    syncGuestWishlist() {
        const guestIds = this.loadFromStorage();
        if (guestIds && guestIds.length > 0 && this.authService.isAuthenticated()) {
            const syncNext = () => {
                if (guestIds.length === 0) {
                    localStorage.removeItem(this.KEY);
                    this.getWishlist().subscribe();
                    return;
                }
                const idProduct = guestIds.shift();
                if (idProduct) {
                    this.http.post(`${this.url}/items`, { idProduct }).subscribe({
                        next: () => syncNext(),
                        error: (err) => {
                            console.error('Error syncing wishlist item', err);
                            syncNext();
                        }
                    });
                }
            };
            syncNext();
        } else if (this.authService.isAuthenticated()) {
            this.getWishlist().subscribe();
        }
    }

    private loadFromStorage(): string[] {
        try {
            return JSON.parse(localStorage.getItem(this.KEY) ?? '[]');
        } catch {
            return [];
        }
    }

    private saveToStorage(ids: string[]) {
        localStorage.setItem(this.KEY, JSON.stringify(ids));
    }
}
