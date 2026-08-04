import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WishlistService {
    private readonly KEY = 'onetech_wishlist';
    private _ids = signal<string[]>(this.loadFromStorage());

    ids = this._ids.asReadonly();
    count = computed(() => this._ids().length);

    isInWishlist(productId: string): boolean {
        return this._ids().includes(productId);
    }

    toggle(productId: string): boolean {
        const current = this._ids();
        const idx = current.indexOf(productId);
        let next: string[];

        if (idx === -1) {
            next = [...current, productId];
        } else {
            next = current.filter(id => id !== productId);
        }

        this._ids.set(next);
        this.saveToStorage(next);
        return idx === -1;
    }

    remove(productId: string) {
        const next = this._ids().filter(id => id !== productId);
        this._ids.set(next);
        this.saveToStorage(next);
    }

    clear() {
        this._ids.set([]);
        localStorage.removeItem(this.KEY);
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
