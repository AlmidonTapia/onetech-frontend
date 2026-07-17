import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarMenuComponent } from './components/navbar-menu/navbar-menu';
import { NavbarSearchComponent } from './components/navbar-search/navbar-search';
import { NavbarCartComponent } from './components/navbar-cart/navbar-cart';
import { NavbarUserComponent } from './components/navbar-user/navbar-user';
import { AuthService } from '../../../core/domains/identity/services/auth.service';
import { WishlistStore } from '../../../core/domains/shopping/store/wishlist.store';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle';
import { HasRoleDirective } from '../../directives/has-role.directive';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NavbarMenuComponent, NavbarSearchComponent, NavbarCartComponent, NavbarUserComponent, ThemeToggleComponent, HasRoleDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  wishlistStore = inject(WishlistStore);
  ts = inject(TranslationService);
  t = this.ts.t;

  get topbarInfo() {
    return {
      left: { icon: 'pi-truck', text: this.t().navbar.topbar.shipping },
      right: [
        { icon: 'pi-phone', text: this.t().navbar.topbar.phone },
        { icon: 'pi-clock', text: this.t().navbar.topbar.hours }
      ]
    };
  }
}
