import { Injectable, inject, signal, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth-response.model';
import { CartService } from './cart.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private injector = inject(Injector); // Use Injector to avoid circular dependency
  
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
          role: decoded.role as 'ADMIN' | 'CLIENT'
        };
        return authData;
      }),
      tap(authData => {
        localStorage.setItem(this.TOKEN_KEY, authData.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(authData));
        this.currentUser.set(authData);
        
        // Use Injector to get CartService dynamically
        const cartService = this.injector.get(CartService);
        cartService.syncGuestCart();
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
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'ADMIN';
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
