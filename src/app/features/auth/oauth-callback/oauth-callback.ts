import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/domains/identity/services/auth.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
      <i class="pi pi-spin pi-spinner" style="font-size: 3rem; color: var(--primary-color);"></i>
      <p style="margin-top: 1rem; color: var(--text-color-secondary);">Completando inicio de sesión...</p>
    </div>
  `
})
export class OAuthCallbackComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token');

    if (!token) {
      token = this.getCookie('oauth2_token');
    }

    if (token) {
      try {
        this.authService.handleOAuthCallback(token);
        this.deleteCookie('oauth2_token');
        this.alertService.success('Bienvenido', 'Has iniciado sesión con Google.');
      } catch (err) {
        this.alertService.error('Error', 'No se pudo procesar la sesión de Google.');
        this.router.navigate(['/auth/login']);
      }
    } else {
      this.alertService.error('Error', 'No se recibió el token de autenticación.');
      this.router.navigate(['/auth/login']);
    }
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  private deleteCookie(name: string) {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}
