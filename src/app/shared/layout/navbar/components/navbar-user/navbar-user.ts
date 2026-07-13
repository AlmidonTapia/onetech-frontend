import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../../../core/domains/identity/services/auth.service';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-navbar-user',
  standalone: true,
  imports: [RouterLink, Popover],
  templateUrl: './navbar-user.html',
  styleUrl: './navbar-user.css'
})
export class NavbarUserComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  content = {
    guest: {
      label: 'Bienvenido',
      name: 'Inicia sesión',
      route: '/auth/login'
    },
    user: {
      label: 'MI CUENTA',
      defaultName: 'Usuario',
      menu: [
        { label: 'Mi perfil', route: '/profile', icon: 'pi pi-user' },
        { label: 'Mis compras', route: '/profile/orders', icon: 'pi pi-shopping-bag' },
        { label: 'Favoritos', route: '/wishlist', icon: 'pi pi-heart' }
      ],
      logout: 'Cerrar sesión'
    }
  };

  onLogout(op: any) {
    op.hide();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
