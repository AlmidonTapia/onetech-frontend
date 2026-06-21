import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarMenuComponent } from './components/navbar-menu/navbar-menu';
import { NavbarSearchComponent } from './components/navbar-search/navbar-search';
import { NavbarCartComponent } from './components/navbar-cart/navbar-cart';
import { AuthService } from '../../../core/services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle';
import { HasRoleDirective } from '../../directives/has-role.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NavbarMenuComponent, NavbarSearchComponent, NavbarCartComponent, ThemeToggleComponent, HasRoleDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  wishlistService = inject(WishlistService);

  content = {
    homeRoute: '/',
    ariaLabelLogo: 'OneTech — Inicio',
    ariaLabelNav: 'Categorías',

    account: {
      profileRoute: '/profile',
      loginRoute: '/auth/login',
      labelAuthenticated: 'Mi cuenta',
      labelGuest: 'Hola, ingresa',
      defaultName: 'Mi cuenta'
    },

    admin: {
      route: '/admin',
      labelPre: 'Panel de',
      labelPost: 'Administración'
    },

    wishlist: {
      route: '/wishlist',
      title: 'Mis favoritos',
      labelPre: 'Lista de',
      labelPost: 'Favoritos'
    }
  };

  topbarInfo = {
    left: { icon: 'pi-truck', text: 'Envío gratis desde S/ 199 · Lima' },
    right: [
      { icon: 'pi-phone', text: '+51 (01) 234-5678' },
      { icon: 'pi-clock', text: 'Lun–Sab 9am–6pm' }
    ]
  };
}
