import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../../../core/domains/identity/services/auth.service';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-navbar-user',
  standalone: true,
  imports: [RouterLink, Popover],
  templateUrl: './navbar-user.html'
})
export class NavbarUserComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  get currentUrl() {
    return this.router.url;
  }
  get menu() {
    return [
      { label: 'Mi perfil', route: '/profile', icon: 'pi pi-user' },
      { label: 'Mis compras', route: '/profile/orders', icon: 'pi pi-shopping-bag' },
      { label: 'Favoritos', route: '/wishlist', icon: 'pi pi-heart' }
    ];
  }

  onLogout(op: any) {
    op.hide();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
