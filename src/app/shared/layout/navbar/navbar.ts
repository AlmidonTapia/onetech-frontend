import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { NavbarMenuComponent } from './components/navbar-menu/navbar-menu';
import { NavbarSearchComponent } from './components/navbar-search/navbar-search';
import { NavbarCartComponent } from './components/navbar-cart/navbar-cart';
import { NavbarUserComponent } from './components/navbar-user/navbar-user';
import { AuthService } from '../../../core/domains/identity/services/auth.service';
import { WishlistStore } from '../../../core/domains/shopping/store/wishlist.store';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgClass, NavbarMenuComponent, NavbarSearchComponent, NavbarCartComponent, NavbarUserComponent, ThemeToggleComponent, HasRoleDirective],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  authService = inject(AuthService);
  wishlistStore = inject(WishlistStore);
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  get topbarInfo() {
    return {
      left: { icon: 'pi-truck', text: 'Envíos a nivel nacional' },
      right: [
        { icon: 'pi-phone', text: 'Teléfono de contacto' },
        { icon: 'pi-clock', text: 'Horarios de atención' }
      ]
    };
  }
}
