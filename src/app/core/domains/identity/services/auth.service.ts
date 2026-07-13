import { Injectable, inject, signal, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth-response.model';
import { UserRole } from '../enums/user-role.enum';
import { CartStore } from '../../shopping/store/cart.store';
import { WishlistStore } from '../../shopping/store/wishlist.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private injector = inject(Injector); 
  
  private readonly TOKEN_KEY = 'onetech_token';
  private readonly USER_KEY  = 'onetech_user';

  currentUser = signal<AuthResponse | null>(this.getUserFromStorage());

  login(credentials: LoginRequest) {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/users/login`, credentials).pipe(
      map(res => {
        const decoded = this.decodeToken(res.token);
        const authData: AuthResponse = {
          token: res.token,
          tokenType: 'Bearer',
          userId: decoded.id,
          email: decoded.sub,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          role: decoded.role as UserRole
        };
        return authData;
      }),
      tap(authData => {
        localStorage.setItem(this.TOKEN_KEY, authData.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(authData));
        this.currentUser.set(authData);
        
        const cartStore = this.injector.get(CartStore);
        const wishlistStore = this.injector.get(WishlistStore);
        cartStore.syncGuestCart();
        wishlistStore.syncGuestWishlist();
      })
    );
  }

  register(data: RegisterRequest) {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/users/register`, data);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  forgotPassword(email: string) {
    return this.http.post(`${environment.apiUrl}/users/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${environment.apiUrl}/users/reset-password`, { token, newPassword });
  }

  loginWithGoogle() {
    const baseUrl = environment.apiUrl.replace('/api/v1', '');
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  }

  handleOAuthCallback(token: string) {
    const decoded = this.decodeToken(token);
    const authData: AuthResponse = {
      token: token,
      tokenType: 'Bearer',
      userId: decoded.id || '',
      email: decoded.sub,
      firstName: decoded.firstName || '',
      lastName: decoded.lastName || '',
      role: decoded.role as UserRole
    };
    localStorage.setItem(this.TOKEN_KEY, authData.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authData));
    this.currentUser.set(authData);
    
    const cartStore = this.injector.get(CartStore);
    const wishlistStore = this.injector.get(WishlistStore);
    cartStore.syncGuestCart();
    wishlistStore.syncGuestWishlist();
    
    this.router.navigate(['/profile']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const decoded = this.decodeToken(token);
      if (!decoded.exp) return false;
      return Date.now() >= decoded.exp * 1000;
    } catch (e) {
      return true;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === UserRole.ADMIN;
  }

  private getUserFromStorage(): AuthResponse | null {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return {};
    }
  }
}
