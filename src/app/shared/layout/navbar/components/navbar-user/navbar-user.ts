import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../../../core/domains/identity/services/auth.service';
import { Popover } from 'primeng/popover';
import { TranslationService } from '../../../../../core/services/translation.service';

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

  get currentUrl() {
    return this.router.url;
  }

  ts = inject(TranslationService);
  t = this.ts.t;

  get menu() {
    return [
      { label: this.t().navbar.user.menu.profile, route: '/profile', icon: 'pi pi-user' },
      { label: this.t().navbar.user.menu.orders, route: '/profile/orders', icon: 'pi pi-shopping-bag' },
      { label: this.t().navbar.user.menu.wishlist, route: '/wishlist', icon: 'pi pi-heart' }
    ];
  }

  onLogout(op: any) {
    op.hide();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
